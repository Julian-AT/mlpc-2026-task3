"use client";

import SlideShell from "@/components/pitch/slide-shell";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import slidesData from "@/data/slides-data.json";

const severityStyles = {
  high: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  medium: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  low: "bg-chart-3/15 text-chart-3 border-chart-3/30",
} as const;

export function SlideDisagreements() {
  const sources = slidesData.disagreementSources;
  return (
    <SlideShell title="Disagreement Sources" className="xl:grid-cols-2">
      <div className="flex flex-col gap-6">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-semibold tracking-tight"
        >
          Four Sources of Annotation Disagreement
        </motion.h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Verification of five assigned recordings revealed inter-annotator agreement
          ranging from <span className="font-bold text-foreground">24.1%</span> to{" "}
          <span className="font-bold text-foreground">93.0%</span>.
          Agreement degraded monotonically with recording complexity.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {sources.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
          >
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold">{s.title}</h4>
                <Badge
                  variant="outline"
                  className={severityStyles[s.severity as keyof typeof severityStyles]}
                >
                  {s.severity}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{s.description}</p>
              <p className="mt-1 text-xs text-muted-foreground/70 italic">
                {s.impact}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </SlideShell>
  );
}
