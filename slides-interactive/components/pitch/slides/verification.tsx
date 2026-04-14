"use client";

import SlideShell from "@/components/pitch/slide-shell";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const steps = [
  {
    step: "1",
    title: "Compare",
    description:
      "Side-by-side comparison of annotations from multiple annotators per recording.",
  },
  {
    step: "2",
    title: "Identify",
    description:
      "Identified discrepancies in class labels and temporal boundaries between annotators.",
  },
  {
    step: "3",
    title: "Correct & Review",
    description:
      "Corrected errors where appropriate. Accepted, fixed, or rejected each recording.",
  },
];

const stats = [
  { label: "Recordings Verified", value: "5" },
  { label: "Agreement Range", value: "24% - 93%" },
  { label: "Total Annotators", value: "602" },
  { label: "Total Recordings", value: "3,656" },
];

export function SlideVerification() {
  return (
    <SlideShell title="Verification Process" className="xl:grid-cols-2">
      <div className="flex flex-col gap-6">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-semibold tracking-tight"
        >
          Label Studio Review
        </motion.h2>
        <div className="flex flex-col gap-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.4 }}
            >
              <Card className="flex gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {s.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
          >
            <Card className="flex flex-col items-center justify-center gap-2 p-6">
              <span className="text-3xl font-bold tabular-nums">{stat.value}</span>
              <span className="text-center text-sm text-muted-foreground">
                {stat.label}
              </span>
            </Card>
          </motion.div>
        ))}
      </div>
    </SlideShell>
  );
}
