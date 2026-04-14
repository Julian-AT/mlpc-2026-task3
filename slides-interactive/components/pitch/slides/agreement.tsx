"use client";

import SlideShell from "@/components/pitch/slide-shell";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import slidesData from "@/data/slides-data.json";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

const chartData = slidesData.classAgreement.map((d) => ({
  name: d.short,
  iou: d.iou,
  fullName: d.class.replace(/_/g, " "),
}));

function getBarColor(iou: number): string {
  if (iou >= 0.75) return "hsl(var(--chart-3))";
  if (iou >= 0.55) return "hsl(var(--chart-2))";
  return "hsl(var(--chart-4))";
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { fullName: string; iou: number } }>;
}

function ChartTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <Card className="px-3 py-2 shadow-lg">
      <p className="font-semibold">{data.fullName}</p>
      <p className="text-sm text-muted-foreground">
        IoU: <span className="font-mono font-bold">{data.iou.toFixed(3)}</span>
      </p>
    </Card>
  );
}

export function SlideAgreement() {
  return (
    <SlideShell title="Agreement Overview" className="xl:grid-cols-2">
      <div className="flex flex-col gap-6">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-semibold tracking-tight"
        >
          Per-Class IoU Agreement
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="h-[450px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[0, 1]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <YAxis dataKey="name" type="category" width={70} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine x={slidesData.overallIoU} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" label={{ value: `Mean: ${slidesData.overallIoU}`, position: "top", fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
              <Bar dataKey="iou" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={getBarColor(entry.iou)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
        <div className="flex justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-sm bg-chart-3" /> High (&ge;0.75)</span>
          <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-sm bg-chart-2" /> Moderate</span>
          <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-sm bg-chart-4" /> Low (&lt;0.55)</span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-semibold tracking-tight">Key Statistics</h3>
        {[
          { label: "Overall Mean IoU", value: slidesData.overallIoU.toFixed(3), desc: "Moderate agreement" },
          { label: "Own-Recording Pairs", value: slidesData.ownPairsIoU.toFixed(3), desc: "Higher for familiar recordings" },
          { label: "External Pairs", value: slidesData.otherPairsIoU.toFixed(3), desc: "Lower without familiarity" },
          { label: "Best Class", value: "vacuum (0.870)", desc: "Sustained, distinct sound" },
          { label: "Worst Class", value: "light_switch (0.179)", desc: "Brief transient event" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <Card className="p-3">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-semibold">{stat.label}</span>
                <span className="font-mono font-bold text-primary">{stat.value}</span>
              </div>
              <p className="text-xs text-muted-foreground">{stat.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </SlideShell>
  );
}
