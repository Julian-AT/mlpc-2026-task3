"use client";

import { useMemo, useState } from "react";
import { mlpcDeckData, CLASS_COLOR } from "@/lib/mlpc-deck-data";
import { SHORT_CLASS_LABELS } from "@/lib/class-labels";
import { cn } from "@/lib/utils";

function heatColor(v: number, vmax: number) {
  const t = vmax > 0 ? Math.min(1, v / vmax) : 0;
  const h = 40 + (1 - t) * 40;
  const l = 28 + t * 32;
  return `hsl(${h} 70% ${l}%)`;
}

export function CooccurrenceHeatmap() {
  const shortLabels: string[] = [...SHORT_CLASS_LABELS];
  const matrix = mlpcDeckData.labels.cooccurrenceCond;
  const [selected, setSelected] = useState<number | null>(null);

  const vmax = useMemo(() => {
    let m = 0;
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (i !== j) m = Math.max(m, matrix[i][j] ?? 0);
      }
    }
    return m || 1;
  }, [matrix]);

  const size = 280;
  const n = matrix.length;
  const cell = size / n;

  return (
    <div className="flex flex-col gap-2">
      <svg
        width={size + 120}
        height={size + 40}
        className="max-w-full overflow-visible text-[8px] md:text-[9px]"
      >
        <text x={0} y={12} className="fill-muted-foreground text-[10px]">
          P(col | row) — click a row class
        </text>
        {matrix.map((row, i) =>
          row.map((val, j) => {
            if (i === j) return null;
            const x = 100 + j * cell;
            const y = 24 + i * cell;
            const dim =
              selected !== null && selected !== i && selected !== j ? 0.35 : 1;
            return (
              <rect
                key={`${i}-${j}`}
                x={x}
                y={y}
                width={cell - 1}
                height={cell - 1}
                rx={2}
                opacity={dim}
                fill={heatColor(val, vmax)}
                stroke={
                  selected === i || selected === j
                    ? "hsl(var(--primary))"
                    : "transparent"
                }
                strokeWidth={selected === i || selected === j ? 1.5 : 0}
                className="cursor-pointer"
                onClick={() => setSelected((s) => (s === i ? null : i))}
              >
                <title>
                  {shortLabels[i]} → {shortLabels[j]}: {(val * 100).toFixed(1)}%
                </title>
              </rect>
            );
          }),
        )}
        {shortLabels.map((lab, j) => (
          <text
            key={`c${j}`}
            x={100 + j * cell + cell / 2}
            y={18}
            textAnchor="middle"
            className="fill-muted-foreground"
          >
            {lab}
          </text>
        ))}
        {shortLabels.map((lab, i) => (
          <text
            key={`r${i}`}
            x={92}
            y={24 + i * cell + cell / 2 + 3}
            textAnchor="end"
            className="fill-muted-foreground"
          >
            {lab}
          </text>
        ))}
      </svg>
      {selected != null && (
        <div className="text-xs text-muted-foreground">
          Row{" "}
          <span
            className="font-medium text-foreground"
            style={{
              color: CLASS_COLOR[mlpcDeckData.labels.classSegments[selected]?.class ?? ""],
            }}
          >
            {mlpcDeckData.labels.classSegments[selected]?.class.replaceAll("_", " ")}
          </span>
          : co-occurrence with other classes (diagonal masked in the report).
        </div>
      )}
    </div>
  );
}
