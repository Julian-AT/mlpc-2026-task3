"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StageData {
  raw: number[];
  binarized: number[];
  voteCount: number;
  votePct: string;
  finalLabel: boolean;
}

const EXAMPLE_DATA: StageData[] = [
  { raw: [0.82, 0.31, 0.95], binarized: [1, 0, 1], voteCount: 2, votePct: "67%", finalLabel: true },
  { raw: [0.12, 0.08, 0.45], binarized: [0, 0, 0], voteCount: 0, votePct: "0%", finalLabel: false },
  { raw: [0.91, 0.73, 0.88], binarized: [1, 1, 1], voteCount: 3, votePct: "100%", finalLabel: true },
  { raw: [0.55, 0.42, 0.61], binarized: [1, 0, 1], voteCount: 2, votePct: "67%", finalLabel: true },
];

const STAGE_LABELS = ["Raw Overlaps", "Binarize (θ=0.5)", "Vote Count", "Final Label"];

export function MajorityVotePipeline() {
  const [activeStage, setActiveStage] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPlaying(true);
      setActiveStage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isPlaying || activeStage < 0) return;
    if (activeStage >= 3) return;
    const timer = setTimeout(() => setActiveStage(prev => prev + 1), 1200);
    return () => clearTimeout(timer);
  }, [activeStage, isPlaying]);

  const replay = () => {
    setActiveStage(-1);
    setIsPlaying(false);
    setTimeout(() => {
      setIsPlaying(true);
      setActiveStage(0);
    }, 300);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Stage headers */}
      <div className="grid grid-cols-4 gap-4 w-full max-w-[750px]">
        {STAGE_LABELS.map((label, i) => (
          <motion.div
            key={label}
            className={`text-center text-sm font-semibold px-3 py-2 rounded-lg border transition-colors ${
              activeStage >= i
                ? "border-chart-1 bg-chart-1/10 text-chart-1"
                : "border-border text-muted-foreground"
            }`}
            animate={{ scale: activeStage === i ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {label}
          </motion.div>
        ))}
      </div>

      {/* Arrow flow */}
      <div className="grid grid-cols-4 gap-4 w-full max-w-[750px]">
        {EXAMPLE_DATA.map((row, rowIdx) => (
          <AnimatePresence key={rowIdx} mode="wait">
            {/* Stage 0: Raw values */}
            {activeStage >= 0 && (
              <motion.div
                key={`raw-${rowIdx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIdx * 0.08, duration: 0.3 }}
                className="flex gap-1 justify-center"
              >
                {row.raw.map((v, i) => (
                  <div
                    key={i}
                    className="w-12 h-10 rounded text-xs font-mono flex items-center justify-center border border-border"
                    style={{
                      backgroundColor: `hsl(var(--chart-1) / ${v * 0.7})`,
                      color: v > 0.5 ? "white" : "hsl(var(--muted-foreground))",
                    }}
                  >
                    {v.toFixed(2)}
                  </div>
                ))}
              </motion.div>
            )}

            {/* Stage 1: Binarized */}
            {activeStage >= 1 && (
              <motion.div
                key={`bin-${rowIdx}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: rowIdx * 0.08, duration: 0.3 }}
                className="flex gap-1 justify-center"
              >
                {row.binarized.map((v, i) => (
                  <div
                    key={i}
                    className={`w-12 h-10 rounded text-sm font-bold flex items-center justify-center border ${
                      v === 1
                        ? "bg-chart-3/30 border-chart-3 text-chart-3"
                        : "bg-chart-4/10 border-chart-4/30 text-chart-4/60"
                    }`}
                  >
                    {v}
                  </div>
                ))}
              </motion.div>
            )}

            {/* Stage 2: Vote count */}
            {activeStage >= 2 && (
              <motion.div
                key={`vote-${rowIdx}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rowIdx * 0.08, duration: 0.3 }}
                className="flex items-center justify-center"
              >
                <div className="rounded-lg border border-border px-4 py-2 text-center">
                  <span className="text-lg font-bold">{row.voteCount}/3</span>
                  <span className="ml-2 text-xs text-muted-foreground">({row.votePct})</span>
                </div>
              </motion.div>
            )}

            {/* Stage 3: Final label */}
            {activeStage >= 3 && (
              <motion.div
                key={`final-${rowIdx}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: rowIdx * 0.1, duration: 0.4, type: "spring" }}
                className="flex items-center justify-center"
              >
                <div className={`rounded-full px-4 py-2 text-sm font-bold ${
                  row.finalLabel
                    ? "bg-chart-3/20 text-chart-3 border border-chart-3/50"
                    : "bg-chart-4/20 text-chart-4 border border-chart-4/50"
                }`}>
                  {row.finalLabel ? "PRESENT" : "ABSENT"}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>

      {/* Formula */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: activeStage >= 3 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-xl border border-border bg-card/50 px-6 py-3 text-center backdrop-blur-sm"
      >
        <span className="font-mono text-sm text-muted-foreground">
          y<sub>t,c</sub> = <span className="text-primary">1</span>[
          <span className="text-chart-2"> mean(binarized) </span>
          &ge; 0.5 ]
        </span>
      </motion.div>

      {/* Replay button */}
      {activeStage >= 3 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={replay}
          className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors"
        >
          Replay Animation
        </motion.button>
      )}
    </div>
  );
}
