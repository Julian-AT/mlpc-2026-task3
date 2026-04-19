"use client";

import { useMemo, useState } from "react";
import { useDrag } from "@use-gesture/react";
import { mlpcDeckData, CLASS_COLOR } from "@/lib/mlpc-deck-data";
import { cn } from "@/lib/utils";

export function TsneScatter({ className }: { className?: string }) {
  const points = mlpcDeckData.tsne.points;
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const bind = useDrag(({ delta: [dx, dy] }) => {
    setPos((p) => ({ x: p.x + dx, y: p.y + dy }));
  });

  const view = useMemo(() => {
    if (!points.length) return { minX: -1, maxX: 1, minY: -1, maxY: 1 };
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    };
  }, [points]);

  const w = 360;
  const h = 260;
  const pad = 16;

  const project = (px: number, py: number) => {
    const nx = (px - view.minX) / (view.maxX - view.minX || 1);
    const ny = (py - view.minY) / (view.maxY - view.minY || 1);
    return {
      cx: pad + nx * (w - pad * 2),
      cy: pad + (1 - ny) * (h - pad * 2),
    };
  };

  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-[10px] text-muted-foreground">
        Drag the plot to pan (explore dense regions).
      </p>
      <div
        className="relative touch-none overflow-hidden rounded-md border bg-muted/20"
        style={{ width: w, height: h, maxWidth: "100%" }}
        {...bind()}
      >
        <div
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            width: "100%",
            height: "100%",
          }}
        >
          <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`}>
            {points.map((p, i) => {
              const { cx, cy } = project(p.x, p.y);
              const fill = CLASS_COLOR[p.class] ?? "hsl(var(--primary))";
              return <circle key={i} cx={cx} cy={cy} r={2.2} fill={fill} opacity={0.75} />;
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
