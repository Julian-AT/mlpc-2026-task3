"use client";

import SlideShell from "@/components/pitch/slide-shell";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import slidesData from "@/data/slides-data.json";

const severityStyles = {
  high: { border: "border-chart-4/30", bg: "bg-chart-4/5", badge: "bg-chart-4/15 text-chart-4 border-chart-4/30", label: "High" },
  medium: { border: "border-chart-2/30", bg: "bg-chart-2/5", badge: "bg-chart-2/15 text-chart-2 border-chart-2/30", label: "Medium" },
  low: { border: "border-chart-3/30", bg: "bg-chart-3/5", badge: "bg-chart-3/15 text-chart-3 border-chart-3/30", label: "Low" },
} as const;

export function SlideConclusions() {
  return (
    <SlideShell title="Conclusions" className="xl:grid-cols-2">
      <div className="flex flex-col gap-6">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-semibold tracking-tight"
        >
          Dataset Biases
        </motion.h2>
        <div className="grid grid-cols-1 gap-3">
          {slidesData.biases.map((bias, i) => {
            const sev = severityStyles[bias.severity as keyof typeof severityStyles];
            return (
              <motion.div
                key={bias.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.4 }}
              >
                <Card className={`border-2 ${sev.border} ${sev.bg} p-4`}>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm">{bias.title}</h3>
                    <Badge variant="outline" className={sev.badge}>
                      {sev.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{bias.description}</p>
                  <p className="text-xs text-muted-foreground/70 italic mt-1">{bias.consequence}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-4 justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Card className="border-2 border-primary/30 bg-primary/5 p-6">
            <h3 className="text-lg font-bold text-primary mb-2">Suitability Verdict</h3>
            <p className="text-sm text-muted-foreground">
              The dataset is <span className="font-semibold text-foreground">broadly suitable</span> for training sound event detectors,
              providing diverse domestic recordings with multi-annotator labels across 15 classes.
            </p>
            <div className="mt-3 space-y-2">
              <p className="text-xs text-muted-foreground font-semibold">Key Challenges:</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Severe class imbalance for transient events</li>
                <li>Moderate inter-annotator agreement (IoU = 0.64)</li>
                <li>High co-occurrence rates requiring multi-label classification</li>
                <li>Acoustically similar class pairs (door/wardrobe, bell/phone)</li>
              </ul>
            </div>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <Card className="p-4">
            <h3 className="text-sm font-bold mb-2">Mitigations</h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <Card className="p-2 bg-card/50">Data augmentation</Card>
              <Card className="p-2 bg-card/50">Class-balanced sampling</Card>
              <Card className="p-2 bg-card/50">Label smoothing</Card>
              <Card className="p-2 bg-card/50">On-device processing</Card>
            </div>
          </Card>
        </motion.div>
      </div>
    </SlideShell>
  );
}
