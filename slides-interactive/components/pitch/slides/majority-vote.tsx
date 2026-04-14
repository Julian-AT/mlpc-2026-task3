"use client";

import SlideShell from "@/components/pitch/slide-shell";
import { MajorityVotePipeline } from "@/components/d3/majority-vote-pipeline";
import { motion } from "framer-motion";

export function SlideMajorityVote() {
  return (
    <SlideShell title="Majority Vote Pipeline" className="xl:grid-cols-1">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight">
            Converting Annotations to Labels
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Multi-annotator overlaps → binary prediction targets via binarization + majority vote
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <MajorityVotePipeline />
        </motion.div>
      </div>
    </SlideShell>
  );
}
