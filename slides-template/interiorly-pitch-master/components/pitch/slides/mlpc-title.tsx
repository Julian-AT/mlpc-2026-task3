"use client";

import SlideShell from "@/components/pitch/slide-shell";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { mlpcDeckData } from "@/lib/mlpc-deck-data";

const stats = [
  { value: () => mlpcDeckData.agreement.totalRecordings.toLocaleString(), label: "recordings" },
  { value: () => mlpcDeckData.labels.totalSegments.toLocaleString(), label: "segments" },
  { value: () => "15", label: "classes" },
  { value: () => "47", label: "features" },
  { value: () => String(mlpcDeckData.metadata.uniqueDevices), label: "devices" },
];

export function SlideMlpcTitle() {
  return (
    <SlideShell title="MLPC 2026 · Task 3" className="col-span-3">
      <div className="col-span-3 mx-auto flex max-w-3xl flex-col items-start gap-8">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold tracking-tight md:text-6xl"
        >
          Data Exploration Report
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg leading-relaxed text-muted-foreground"
        >
          Sound event detection for smart homes — verifying annotations,
          quantifying agreement, characterizing the label and feature space,
          and identifying biases for the modeling phase.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-wrap gap-3"
        >
          {stats.map((s, i) => (
            <motion.span
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.07 }}
              className="rounded-full border border-border/60 px-4 py-1.5 text-sm"
            >
              <span className="font-mono font-semibold tabular-nums">{s.value()}</span>{" "}
              <span className="text-muted-foreground">{s.label}</span>
            </motion.span>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-sm text-muted-foreground"
        >
          Team A-C · Julian Schmidt · Paul Breburda ·{" "}
          <a
            href={siteConfig.links.github}
            className="underline underline-offset-4 hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </motion.p>
      </div>
    </SlideShell>
  );
}
