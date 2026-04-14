"use client";

import SlideShell from "@/components/pitch/slide-shell";
import { ThresholdExplorer } from "@/components/d3/threshold-explorer";
import { motion } from "framer-motion";

export function SlideThreshold() {
  return (
    <SlideShell title="Threshold Explorer" className="xl:grid-cols-1">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight">
            Interactive Binarization Threshold
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Explore how different thresholds affect label creation from raw annotation overlaps
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full"
        >
          <ThresholdExplorer />
        </motion.div>
      </div>
    </SlideShell>
  );
}
