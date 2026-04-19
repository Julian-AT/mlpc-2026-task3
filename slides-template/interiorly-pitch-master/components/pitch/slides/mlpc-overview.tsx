"use client";

import SlideShell from "@/components/pitch/slide-shell";
import { motion } from "framer-motion";

const items = [
  "Verified annotations in Label Studio — spectrogram playback, side-by-side annotator comparison.",
  "Applied boundary rules (±1 s tolerance) to accept, fix, or reject each labeled region.",
  "Measured inter-annotator agreement via segment-level IoU, comparing own vs. external pairs.",
  "Aggregated labels with majority vote on binarized overlap; characterized the 15-class label space.",
  "Profiled metadata and 47-D audio features — correlation structure, t-SNE embedding, dataset biases.",
];

export function SlideMlpcOverview() {
  return (
    <SlideShell title="What we did" className="col-span-3">
      <div className="col-span-3 mx-auto flex max-w-2xl flex-col gap-6">
        <ol className="space-y-4">
          {items.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.12 }}
              className="flex items-start gap-3 text-muted-foreground"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-xs font-medium text-foreground">
                {i + 1}
              </span>
              <span className="pt-0.5">{item}</span>
            </motion.li>
          ))}
        </ol>
      </div>
    </SlideShell>
  );
}
