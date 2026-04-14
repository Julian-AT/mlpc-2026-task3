"use client";

import SlideShell from "@/components/pitch/slide-shell";
import { TrainingVisualization } from "@/components/training/training-visualization";
import { motion } from "framer-motion";

export function SlideTraining() {
  return (
    <SlideShell title="In-Browser Training" className="xl:grid-cols-1">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight">
            Live Model Training
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Train a multi-label MLP on 2,000 high-agreement segments directly in your browser via TensorFlow.js
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full"
        >
          <TrainingVisualization />
        </motion.div>
      </div>
    </SlideShell>
  );
}
