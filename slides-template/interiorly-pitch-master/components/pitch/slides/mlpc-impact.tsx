"use client";

import SlideShell from "@/components/pitch/slide-shell";
import { siteConfig } from "@/config/site";
import { motion } from "framer-motion";

const benefits = [
  "Assistive listening for hearing-impaired users",
  "Elderly care monitoring — fall detection, medication reminders",
  "Energy-efficient smart home automation via acoustic context",
];

const risks = [
  "Domestic audio is intimate — prefer on-device processing so raw audio never leaves the home",
  "Informed consent protocols for all deployed systems",
  "Restrict outputs to predefined event categories, not open-ended audio analysis",
  "Publish aggregated features, not source waveforms",
];

export function SlideMlpcImpact() {
  return (
    <SlideShell title="Broader impact & tooling" className="col-span-3">
      <div className="col-span-3 mx-auto flex max-w-2xl flex-col gap-6">
        <div>
          <h3 className="mb-3 font-semibold">Applications</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {benefits.map((b, i) => (
              <motion.li
                key={b}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="flex items-start gap-2"
              >
                <span className="mt-0.5 text-primary">+</span>
                <span>{b}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">Privacy risks & mitigations</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {risks.map((r, i) => (
              <motion.li
                key={r}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-2"
              >
                <span className="mt-0.5 text-destructive">!</span>
                <span>{r}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="rounded-md bg-muted/50 px-4 py-3 text-sm text-muted-foreground"
        >
          <span className="font-medium text-foreground">AI disclosure:</span>{" "}
          Claude Opus 4.6 used for analysis code, LaTeX editing, and this deck.
          All quantitative claims verified against raw data.{" "}
          <a
            className="text-primary underline"
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            Source code
          </a>
        </motion.p>
      </div>
    </SlideShell>
  );
}
