"use client";

import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import slidesData from "@/data/slides-data.json";

const PRESETS = [
  { label: "Conservative", value: 0.7 },
  { label: "Balanced", value: 0.5 },
  { label: "Permissive", value: 0.3 },
] as const;

const sample = slidesData.sampleRecording;

export function ThresholdExplorer() {
  const [threshold, setThreshold] = useState(0.5);

  const { grid, positiveCount, totalCells } = useMemo(() => {
    let count = 0;
    let total = 0;
    const g = sample.data.map((seg) =>
      seg.map((cls) =>
        cls.map((val) => {
          total++;
          const isPositive = val >= threshold;
          if (isPositive) count++;
          return { val, isPositive };
        })
      )
    );
    return { grid: g, positiveCount: count, totalCells: total };
  }, [threshold]);

  const labelCount = useMemo(() => {
    let count = 0;
    sample.data.forEach((seg) =>
      seg.forEach((cls) => {
        const votes = cls.filter((v) => v >= threshold).length;
        if (votes / cls.length >= 0.5) count++;
      })
    );
    return count;
  }, [threshold]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Threshold slider */}
      <div className="flex flex-col items-center gap-3 w-full max-w-lg">
        <div className="flex items-baseline gap-2">
          <span className="text-muted-foreground text-sm">Binarization threshold:</span>
          <span className="text-4xl font-bold font-mono tabular-nums text-primary">
            {threshold.toFixed(2)}
          </span>
        </div>
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={[threshold]}
          onValueChange={([v]) => setThreshold(v)}
          className="w-full"
        />
        <div className="flex gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setThreshold(p.value)}
              className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                Math.abs(threshold - p.value) < 0.01
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-accent"
              }`}
            >
              {p.label} ({p.value})
            </button>
          ))}
        </div>
      </div>

      {/* Annotation grid */}
      <Card className="bg-card/30 p-4 backdrop-blur-sm">
        <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: `80px repeat(${sample.classes.length}, 1fr)` }}>
          <div />
          {sample.classes.map((cls) => (
            <div key={cls} className="text-center text-xs font-semibold text-muted-foreground px-1">
              {cls}
            </div>
          ))}
        </div>

        {grid.map((seg, segIdx) => (
          <div key={segIdx} className="grid gap-1 mb-1" style={{ gridTemplateColumns: `80px repeat(${sample.classes.length}, 1fr)` }}>
            <div className="flex items-center text-xs text-muted-foreground font-mono">
              Seg {segIdx + 1}
            </div>
            {seg.map((cls, clsIdx) => (
              <div key={clsIdx} className="flex gap-0.5 justify-center">
                {cls.map((cell, annIdx) => (
                  <div
                    key={annIdx}
                    className={`w-9 h-8 rounded text-[10px] font-mono flex items-center justify-center transition-all duration-200 border ${
                      cell.isPositive
                        ? "bg-chart-3/40 border-chart-3/60 text-chart-3"
                        : cell.val > 0
                        ? "bg-chart-4/10 border-chart-4/20 text-chart-4/50"
                        : "bg-transparent border-border/50 text-muted-foreground/30"
                    }`}
                  >
                    {cell.val.toFixed(1)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </Card>

      {/* Summary */}
      <div className="flex gap-6 text-center">
        <Card className="px-4 py-2">
          <div className="text-2xl font-bold font-mono tabular-nums text-chart-3">{positiveCount}</div>
          <div className="text-xs text-muted-foreground">Cells above threshold</div>
        </Card>
        <Card className="px-4 py-2">
          <div className="text-2xl font-bold font-mono tabular-nums text-primary">{labelCount}</div>
          <div className="text-xs text-muted-foreground">Positive labels (majority vote)</div>
        </Card>
        <Card className="px-4 py-2">
          <div className="text-2xl font-bold font-mono tabular-nums text-muted-foreground">{totalCells - positiveCount}</div>
          <div className="text-xs text-muted-foreground">Cells below threshold</div>
        </Card>
      </div>
    </div>
  );
}
