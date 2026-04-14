"use client";

import SlideShell from "@/components/pitch/slide-shell";
import { IoUVisualization } from "@/components/d3/iou-visualization";
import { motion } from "framer-motion";

export function SlideIoUExplained() {
  return (
    <SlideShell title="IoU Explained" className="xl:grid-cols-1">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight">
            Intersection over Union (IoU)
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Measures the overlap between two annotators&apos; segment boundaries
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full"
        >
          <IoUVisualization />
        </motion.div>
      </div>
    </SlideShell>
  );
}
