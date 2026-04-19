"use client";

import { useState } from "react";
import { mlpcDeckData } from "@/lib/mlpc-deck-data";

function color(r: number) {
  const t = (r + 1) / 2;
  const h = 220 * (1 - t);
  const l = 42 + Math.abs(r) * 18;
  const s = 65;
  return `hsl(${h} ${s}% ${l}%)`;
}

export function CorrelationHeatmap() {
  const { labels, matrix } = mlpcDeckData.features.correlation;
  const [hover, setHover] = useState<{ i: number; j: number } | null>(null);
  const n = labels.length;
  const size = 320;
  const cell = size / n;
  const pad = 72;

  return (
    <div className="overflow-x-auto">
      <svg width={pad + size + 8} height={pad + size + 8} className="text-[7px] md:text-[8px]">
        {matrix.map((row, i) =>
          row.map((val, j) => {
            const x = pad + j * cell;
            const y = pad + i * cell;
            const dim = hover && hover.i !== i && hover.j !== j ? 0.25 : 1;
            return (
              <g key={`${i}-${j}`}>
                <rect
                  x={x}
                  y={y}
                  width={cell - 1}
                  height={cell - 1}
                  rx={2}
                  fill={color(val)}
                  opacity={dim}
                  stroke={
                    hover?.i === i && hover?.j === j ? "hsl(var(--primary))" : "transparent"
                  }
                  strokeWidth={1.2}
                  onMouseEnter={() => setHover({ i, j })}
                  onMouseLeave={() => setHover(null)}
                />
                <text
                  x={x + cell / 2}
                  y={y + cell / 2 + 3}
                  textAnchor="middle"
                  className="pointer-events-none fill-foreground/90 font-mono text-[7px]"
                >
                  {Math.abs(val) >= 0.995 ? "1" : val.toFixed(2)}
                </text>
              </g>
            );
          }),
        )}
        {labels.map((lab, k) => (
          <text
            key={`lx-${k}`}
            x={pad + k * cell + cell / 2}
            y={pad - 6}
            textAnchor="end"
            transform={`rotate(-42 ${pad + k * cell + cell / 2} ${pad - 6})`}
            className="fill-muted-foreground"
          >
            {lab}
          </text>
        ))}
        {labels.map((lab, k) => (
          <text
            key={`ly-${k}`}
            x={pad - 8}
            y={pad + k * cell + cell / 2 + 3}
            textAnchor="end"
            className="fill-muted-foreground"
          >
            {lab}
          </text>
        ))}
        <text x={4} y={14} className="fill-muted-foreground text-[10px]">
          Pearson r (dataset export fills exact values)
        </text>
      </svg>
    </div>
  );
}
