"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";

/**
 * Minimal shadcn-style chart shell: wraps Recharts `ResponsiveContainer`
 * with theme-friendly defaults (full chart styling lives in slide components).
 */
export function ChartContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "h-[min(360px,40vh)] w-full text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/50 [&_.recharts-default-legend]:text-muted-foreground",
        className,
      )}
    >
      <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
        {children}
      </RechartsPrimitive.ResponsiveContainer>
    </div>
  );
}

export const ChartTooltip = RechartsPrimitive.Tooltip;

export function ChartTooltipContent({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: string;
  formatter?: (value: number, name: string) => React.ReactNode;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-popover px-2 py-1.5 text-[11px] text-popover-foreground shadow-md">
      {label != null && label !== "" && (
        <div className="mb-0.5 font-medium text-muted-foreground">{label}</div>
      )}
      <ul className="space-y-0.5">
        {payload.map((p, i) => (
          <li key={i} className="flex items-center gap-2">
            <span
              className="inline-block size-2 rounded-[2px]"
              style={{ background: p.color }}
            />
            <span className="text-muted-foreground">{p.name}</span>
            <span className="font-mono tabular-nums">
              {formatter && p.value != null
                ? formatter(p.value, String(p.name))
                : p.value?.toFixed?.(3) ?? p.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
