"use client";

import SlideShell from "@/components/pitch/slide-shell";
import { motion } from "framer-motion";

const biases = [
  "Hardware: iPhone-heavy long tail — mic and noise-floor shift on unseen devices.",
  "Environment: kitchens ~26 % — kitchen-associated classes over-represented.",
  "Annotator: own-recording pairs +0.020 IoU — collector familiarity leaks into labels.",
  "Class frequency: 24:1 max : min — reweight or resample for balanced training.",
];

const recs = [
  "Class-weighted BCE + focal loss for rare transients (light_switch, bell_ringing).",
  "Filter segments with class-level IoU ≥ 0.6 to trim label noise.",
  "Group-stratified splits by collector_id (+ device) to prevent leakage.",
  "Per-class sigmoid heads (multi-label); targeted augmentations on confused pairs.",
];

export function SlideMlpcConclusions() {
  return (
    <SlideShell title="Conclusions" className="col-span-3">
      <div className="col-span-3 mx-auto flex max-w-2xl flex-col gap-6">
        <div>
          <h3 className="mb-3 font-semibold">Dataset biases</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {biases.map((b, i) => (
              <motion.li
                key={`b-${i}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="border-l-2 border-primary/40 pl-3"
              >
                {b}
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 + biases.length * 0.1 }}
        >
          <h3 className="mb-3 font-semibold">Recommendations</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {recs.map((r, i) => (
              <motion.li
                key={`r-${i}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + (biases.length + i) * 0.1 }}
                className="border-l-2 border-chart-2 pl-3"
              >
                {r}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </SlideShell>
  );
}
