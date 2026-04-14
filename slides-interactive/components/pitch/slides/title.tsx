"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/animated-counter";
import { Card } from "@/components/ui/card";

const stats = [
  { label: "Recordings", value: 3656 },
  { label: "Annotators", value: 602 },
  { label: "Sound Classes", value: 15 },
  { label: "Segments", value: 168239, suffix: "" },
];

export function SlideTitle() {
  return (
    <div className="min-h-screen">
      <div className="container relative flex min-h-screen flex-col items-center justify-center text-secondary-foreground">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-6"
        >
          <span className="rounded-full border border-border bg-card/50 px-4 py-1 text-sm text-muted-foreground backdrop-blur-sm">
            MLPC 2026 Task 3
          </span>
          <h1 className="select-none text-center text-4xl font-semibold tracking-tight md:text-6xl lg:text-8xl">
            Qualitative Analysis
          </h1>
          <p className="max-w-2xl text-center text-lg text-muted-foreground md:text-xl">
            Annotation Verification and Inter-Annotator Agreement
          </p>
          <div className="mt-4 flex gap-6 text-sm text-muted-foreground">
            <span>Team A-C</span>
            <span className="text-border">|</span>
            <span>Sound Event Detection</span>
            <span className="text-border">|</span>
            <span>April 2026</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {stats.map((stat, i) => (
            <Card
              key={stat.label}
              className="flex flex-col items-center gap-1 bg-card/50 px-6 py-4 backdrop-blur-sm"
            >
              <AnimatedCounter
                target={stat.value}
                delay={0.6 + i * 0.15}
                separator
                className="text-2xl font-bold tabular-nums text-primary md:text-3xl"
              />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
