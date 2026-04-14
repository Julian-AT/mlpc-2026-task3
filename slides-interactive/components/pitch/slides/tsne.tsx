"use client";

import SlideShell from "@/components/pitch/slide-shell";
import { TsneAnimation } from "@/components/d3/tsne-animation";
import { motion } from "framer-motion";

export function SlideTsne() {
  return (
    <SlideShell title="t-SNE Clustering" className="xl:grid-cols-1">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight">
            Feature Space Visualization
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            t-SNE projection of 47-dimensional audio features for high-agreement single-class segments
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full"
        >
          <TsneAnimation />
        </motion.div>
      </div>
    </SlideShell>
  );
}
