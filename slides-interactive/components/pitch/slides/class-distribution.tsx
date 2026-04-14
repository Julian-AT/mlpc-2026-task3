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
} from "recharts";

const chartData = slidesData.classFrequency.map((d) => ({
  name: d.class.replace(/_/g, " "),
  short: d.class.split("_").map(w => w[0]).join("").toUpperCase(),
  segments: d.segments,
  pct: d.pct,
}));

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { name: string; segments: number; pct: number } }>;
}

function ChartTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <Card className="px-3 py-2 shadow-lg">
      <p className="font-semibold">{data.name}</p>
      <p className="text-sm text-muted-foreground">
        {data.segments.toLocaleString()} segments ({data.pct}%)
      </p>
    </Card>
  );
}

export function SlideClassDistribution() {
  return (
    <SlideShell title="Class Distribution" className="xl:grid-cols-3">
      <div className="col-span-2 flex flex-col gap-6">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-semibold tracking-tight"
        >
          Class Frequency After Majority Vote
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="h-[450px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <YAxis
                dataKey="name" type="category" width={130}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="segments" radius={[0, 4, 4, 0]}>
                {chartData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={`hsl(var(--chart-1) / ${1 - index * 0.04})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
      <div className="flex flex-col gap-4 justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-2 border-chart-4/20 bg-chart-4/5 p-5 text-center">
            <span className="text-4xl font-bold text-chart-4">24:1</span>
            <p className="mt-1 text-sm text-muted-foreground">Imbalance Ratio</p>
            <p className="text-xs text-muted-foreground mt-1">
              footsteps (25,685) vs light_switch (1,047)
            </p>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-4">
            <h3 className="font-semibold text-sm">Implications</h3>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li>Sustained sounds overrepresented by duration</li>
              <li>Multi-label classification necessary</li>
              <li>Requires resampling or loss weighting</li>
            </ul>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="p-4">
            <h3 className="font-semibold text-sm">Notable Co-occurrences</h3>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li>footsteps + most classes</li>
              <li>cutlery + running_water (kitchen)</li>
              <li>door + keychain (entry events)</li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </SlideShell>
  );
}
