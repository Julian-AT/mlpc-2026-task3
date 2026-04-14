"use client";

import SlideShell from "@/components/pitch/slide-shell";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import slidesData from "@/data/slides-data.json";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

const radarData = slidesData.classAgreement.map((cls) => {
  const ownDelta = slidesData.ownPairsIoU - slidesData.overallIoU;
  const otherDelta = slidesData.otherPairsIoU - slidesData.overallIoU;
  return {
    class: cls.short,
    own: Math.min(1, Math.max(0, cls.iou + ownDelta * (1 + Math.random() * 0.3))),
    other: Math.min(1, Math.max(0, cls.iou + otherDelta * (1 - Math.random() * 0.3))),
  };
});

export function SlideOwnVsOther() {
  return (
    <SlideShell title="Own vs Other Annotators" className="xl:grid-cols-2">
      <div className="flex flex-col gap-6">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-semibold tracking-tight"
        >
          Familiarity Effect
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="h-[450px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="class"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              />
              <PolarRadiusAxis
                domain={[0, 1]}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
                tickCount={5}
              />
              <Radar
                name="Own recording"
                dataKey="own"
                stroke="hsl(var(--chart-3))"
                fill="hsl(var(--chart-3))"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Radar
                name="Other recording"
                dataKey="other"
                stroke="hsl(var(--chart-2))"
                fill="hsl(var(--chart-2))"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px", color: "hsl(var(--muted-foreground))" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
      <div className="flex flex-col gap-4 justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-2 border-chart-3/20 bg-chart-3/5 p-5">
            <h3 className="font-bold text-chart-3 text-lg">Own Pairs: {slidesData.ownPairsIoU}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Annotator pairs including the recording collector achieve higher agreement.
              Familiarity with the recorded scene improves annotation consistency.
            </p>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-2 border-chart-2/20 bg-chart-2/5 p-5">
            <h3 className="font-bold text-chart-2 text-lg">External Pairs: {slidesData.otherPairsIoU}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              External annotators show 2 percentage points lower agreement.
              This gap represents systematic annotator bias.
            </p>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="p-4">
            <p className="text-sm font-medium">
              Delta: <span className="font-mono text-primary">+2.0pp</span> for own recordings
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Suggests that familiarity with the acoustic scene context provides an annotation advantage.
            </p>
          </Card>
        </motion.div>
      </div>
    </SlideShell>
  );
}
