"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import type { TrainingMetrics } from "./model";

interface TrainingData {
  features: number[][];
  labels: number[][];
  classNames: string[];
  featureDim: number;
  numClasses: number;
  numSamples: number;
}

type TrainingState = "idle" | "loading" | "training" | "complete";

export function TrainingVisualization() {
  const [state, setState] = useState<TrainingState>("idle");
  const [backend, setBackend] = useState<string>("");
  const [history, setHistory] = useState<TrainingMetrics[]>([]);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [totalEpochs] = useState(20);
  const [classNames, setClassNames] = useState<string[]>([]);
  const trainingRef = useRef(false);

  const startTraining = useCallback(async () => {
    if (trainingRef.current) return;
    trainingRef.current = true;
    setState("loading");
    setHistory([]);
    setCurrentEpoch(0);

    try {
      // Dynamic imports to avoid SSR issues
      const [{ trainModel }, dataModule] = await Promise.all([
        import("./model"),
        import("@/data/training-data.json"),
      ]);

      const data = dataModule.default as TrainingData;
      setClassNames(data.classNames);
      setState("training");

      await trainModel(
        data.features,
        data.labels,
        { epochs: totalEpochs },
        (metrics) => {
          setCurrentEpoch(metrics.epoch);
          setHistory(prev => [...prev, metrics]);
        },
        (backendName) => {
          setBackend(backendName);
        },
      );

      setState("complete");
    } catch (err) {
      console.error("Training failed:", err);
      setState("idle");
    } finally {
      trainingRef.current = false;
    }
  }, [totalEpochs]);

  const latestMetrics = history[history.length - 1];
  const lossData = history.map(h => ({
    epoch: h.epoch,
    "Train Loss": +h.loss.toFixed(4),
    "Val Loss": +h.valLoss.toFixed(4),
  }));

  const f1Data = latestMetrics
    ? classNames.map((name, i) => ({
        name: name.replace(/_/g, " "),
        short: name.split("_").map(w => w[0]).join("").toUpperCase(),
        f1: +(latestMetrics.perClassF1[i] ?? 0).toFixed(3),
      }))
    : [];

  const macroF1 = latestMetrics
    ? latestMetrics.perClassF1.reduce((a, b) => a + b, 0) / latestMetrics.perClassF1.length
    : 0;

  return (
    <div className="grid w-full max-w-6xl grid-cols-1 items-start gap-6 xl:grid-cols-2">
      {/* Left: Controls + Loss Curve */}
      <div className="flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center gap-3">
            <Button
              onClick={startTraining}
              disabled={state === "training" || state === "loading"}
              size="default"
            >
              {state === "idle" ? "Train Model" :
               state === "loading" ? "Loading TF.js..." :
               state === "training" ? "Training..." :
               "Retrain"}
            </Button>
            {backend && (
              <Badge variant="outline" className="bg-chart-5/10 text-chart-5 border-chart-5/30">
                {backend.toUpperCase()}
              </Badge>
            )}
          </div>

          {state !== "idle" && (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Epoch {currentEpoch} / {totalEpochs}</span>
                <span>{Math.round((currentEpoch / totalEpochs) * 100)}%</span>
              </div>
              <Progress value={(currentEpoch / totalEpochs) * 100} />
            </div>
          )}
        </motion.div>

        {/* Model architecture card */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-2">Model Architecture</h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Badge variant="outline">Input(32)</Badge>
            <span>→</span>
            <Badge variant="outline">Dense(128, ReLU)</Badge>
            <span>→</span>
            <Badge variant="outline">Dropout(0.3)</Badge>
            <span>→</span>
            <Badge variant="outline">Dense(64, ReLU)</Badge>
            <span>→</span>
            <Badge variant="outline">Dense(15, σ)</Badge>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Binary cross-entropy loss, Adam optimizer (lr=0.001), 2000 samples
          </p>
        </Card>

        {/* Loss curve */}
        {lossData.length > 0 && (
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Training Loss</h3>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lossData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="epoch"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    label={{ value: "Epoch", position: "bottom", fill: "hsl(var(--muted-foreground))", fontSize: 10, offset: -5 }}
                  />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      color: "hsl(var(--card-foreground))",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Train Loss"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Val Loss"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="5 5"
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="inline-block h-0.5 w-4 bg-chart-1" /> Train
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-0.5 w-4 bg-chart-2 border-dashed" style={{ borderTop: "2px dashed hsl(var(--chart-2))", height: 0 }} /> Validation
              </span>
            </div>
          </Card>
        )}
      </div>

      {/* Right: F1 Scores + Summary */}
      <div className="flex flex-col gap-6">
        {/* Per-class F1 */}
        {f1Data.length > 0 && (
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Per-Class F1 Score</h3>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={f1Data} layout="vertical" margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis
                    type="number"
                    domain={[0, 1]}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={120}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      color: "hsl(var(--card-foreground))",
                    }}
                  />
                  <Bar dataKey="f1" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                    {f1Data.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          entry.f1 >= 0.7
                            ? "hsl(var(--chart-3))"
                            : entry.f1 >= 0.4
                            ? "hsl(var(--chart-2))"
                            : "hsl(var(--chart-4))"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* Summary stats */}
        {state === "complete" && latestMetrics && (
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold font-mono tabular-nums text-chart-3">
                {(latestMetrics.valAccuracy * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">Val Accuracy</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold font-mono tabular-nums text-primary">
                {macroF1.toFixed(3)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Macro F1</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold font-mono tabular-nums text-chart-2">
                {latestMetrics.valLoss.toFixed(4)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Val Loss</div>
            </Card>
          </div>
        )}

        {state === "idle" && (
          <Card className="p-6 text-center border-dashed">
            <p className="text-sm text-muted-foreground">
              Click <span className="font-semibold text-foreground">Train Model</span> to start
              training a multi-label MLP classifier in your browser using TensorFlow.js.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Uses {backend || "WebGPU/WebGL"} acceleration. ~10 seconds on modern hardware.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
