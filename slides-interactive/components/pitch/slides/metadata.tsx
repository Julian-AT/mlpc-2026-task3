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
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface PieTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
}

function PieTooltip({ active, payload }: PieTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <Card className="px-3 py-2 shadow-lg">
      <p className="text-sm">{payload[0].name}: <span className="font-bold">{payload[0].value}%</span></p>
    </Card>
  );
}

export function SlideMetadata() {
  const { devices, placement, environments } = slidesData.metadata;

  return (
    <SlideShell title="Metadata & Devices" className="xl:grid-cols-3">
      {/* Placement pie */}
      <div className="flex flex-col gap-3 items-center">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg font-semibold tracking-tight text-center"
        >
          Device Placement
        </motion.h3>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="h-[200px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={placement}
                dataKey="value"
                nameKey="name"
                cx="50%" cy="50%"
                outerRadius={70}
                label={({ name, value }) => `${name} ${value}%`}
                labelLine={false}
                fontSize={11}
              >
                <Cell fill="hsl(var(--chart-1))" />
                <Cell fill="hsl(var(--chart-2))" />
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
        <div className="flex gap-3 text-xs">
          {placement.map((p, i) => (
            <span key={p.name} className="flex items-center gap-1">
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${i === 0 ? "bg-chart-1" : "bg-chart-2"}`} />
              {p.name}
            </span>
          ))}
        </div>
      </div>

      {/* Top devices */}
      <div className="flex flex-col gap-3">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg font-semibold tracking-tight text-center"
        >
          Top Recording Devices
        </motion.h3>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="h-[350px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={devices} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
              <YAxis dataKey="name" type="category" width={110} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--card-foreground))" }} />
              <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Environments */}
      <div className="flex flex-col gap-3">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-semibold tracking-tight text-center"
        >
          Recording Environments
        </motion.h3>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="h-[350px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={environments} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} domain={[0, 30]} unit="%" />
              <YAxis dataKey="name" type="category" width={85} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--card-foreground))" }} formatter={(value: number) => `${value}%`} />
              <Bar dataKey="pct" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </SlideShell>
  );
}
