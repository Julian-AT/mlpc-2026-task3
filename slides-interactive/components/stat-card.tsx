"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "./animated-counter";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  delay?: number;
}

export function StatCard({ label, value, suffix = "", delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card className="flex flex-col items-center justify-center gap-2 bg-card/50 p-6 backdrop-blur-sm">
        <AnimatedCounter
          target={value}
          suffix={suffix}
          delay={delay}
          className="text-3xl font-bold tabular-nums"
        />
        <span className="text-center text-sm text-muted-foreground">
          {label}
        </span>
      </Card>
    </motion.div>
  );
}
