"use client";

import SlideShell from "@/components/pitch/slide-shell";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import slidesData from "@/data/slides-data.json";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const caseData = slidesData.caseStudy;
const chartData = [
  { class: "door", "Annotator A": caseData.annotators[0].door_open_close, "Annotator B": caseData.annotators[1].door_open_close },
  { class: "footsteps", "Annotator A": caseData.annotators[0].footsteps, "Annotator B": caseData.annotators[1].footsteps },
  { class: "keyboard", "Annotator A": caseData.annotators[0].keyboard_typing, "Annotator B": caseData.annotators[1].keyboard_typing },
  { class: "keychain", "Annotator A": caseData.annotators[0].keychain, "Annotator B": caseData.annotators[1].keychain },
];

const findings = [
  { text: "Annotator A detected only 33% of events identified by Annotator B", type: "critical" },
  { text: "Two of four sound classes entirely omitted by Annotator A", type: "critical" },
  { text: "Missed door events occurred during concurrent keyboard typing (masking)", type: "warning" },
  { text: "Brief keychain event exemplifies transient sound vulnerability", type: "info" },
];

const findingStyles = {
  critical: { badge: "bg-chart-4/15 text-chart-4 border-chart-4/30", icon: "!" },
  warning: { badge: "bg-chart-2/15 text-chart-2 border-chart-2/30", icon: "~" },
  info: { badge: "bg-chart-1/15 text-chart-1 border-chart-1/30", icon: "i" },
} as const;

export function SlideCaseStudy() {
  return (
    <SlideShell title="Case Study" className="xl:grid-cols-2">
      <div className="flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold tracking-tight">
            Lowest Agreement Recording
          </h2>
          <div className="mt-3 flex gap-3">
            <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/30 font-mono">
              {caseData.agreement}% agreement
            </Badge>
            <Badge variant="outline">
              {caseData.duration}s duration
            </Badge>
            <Badge variant="outline">
              Polyphonic
            </Badge>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="class" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--card-foreground))" }} />
              <Legend wrapperStyle={{ fontSize: "12px", color: "hsl(var(--muted-foreground))" }} />
              <Bar dataKey="Annotator A" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Annotator B" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-semibold tracking-tight">Key Findings</h3>
        {findings.map((finding, i) => {
          const style = findingStyles[finding.type as keyof typeof findingStyles];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.12, duration: 0.4 }}
            >
              <Card className="flex gap-3 p-3">
                <Badge variant="outline" className={`h-6 w-6 shrink-0 items-center justify-center rounded-full p-0 text-xs font-bold ${style.badge}`}>
                  {style.icon}
                </Badge>
                <p className="text-sm text-muted-foreground">{finding.text}</p>
              </Card>
            </motion.div>
          );
        })}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.4 }}
        >
          <Card className="border-2 border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-medium">
              Mitigation: additional annotators for complex recordings and label
              smoothing during training.
            </p>
          </Card>
        </motion.div>
      </div>
    </SlideShell>
  );
}
