"use client";

import SlideShell from "@/components/pitch/slide-shell";
import { motion } from "framer-motion";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import slidesData from "@/data/slides-data.json";

const { classes, matrix } = slidesData.cooccurrence;

export function SlideCooccurrence() {
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(null);
  const cellSize = 38;
  const labelWidth = 70;
  const totalSize = cellSize * classes.length;

  return (
    <SlideShell title="Co-occurrence Heatmap" className="xl:grid-cols-1">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight">
            Class Co-occurrence Matrix
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            P(column | row) — conditional probability of class co-occurrence
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative"
        >
          <svg
            viewBox={`0 0 ${totalSize + labelWidth + 20} ${totalSize + labelWidth + 20}`}
            className="w-full max-w-[650px] select-none"
          >
            {/* Column labels (top) */}
            {classes.map((cls, i) => (
              <text
                key={`col-${i}`}
                x={labelWidth + i * cellSize + cellSize / 2}
                y={labelWidth - 5}
                textAnchor="end"
                transform={`rotate(-45, ${labelWidth + i * cellSize + cellSize / 2}, ${labelWidth - 5})`}
                fill={hovered?.col === i ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))"}
                fontSize={9}
                fontWeight={hovered?.col === i ? "bold" : "normal"}
              >
                {cls}
              </text>
            ))}

            {/* Row labels (left) */}
            {classes.map((cls, i) => (
              <text
                key={`row-${i}`}
                x={labelWidth - 5}
                y={labelWidth + i * cellSize + cellSize / 2 + 3}
                textAnchor="end"
                fill={hovered?.row === i ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))"}
                fontSize={9}
                fontWeight={hovered?.row === i ? "bold" : "normal"}
              >
                {cls}
              </text>
            ))}

            {/* Cells */}
            {matrix.map((row, rowIdx) =>
              row.map((value, colIdx) => (
                <g key={`${rowIdx}-${colIdx}`}>
                  <motion.rect
                    x={labelWidth + colIdx * cellSize}
                    y={labelWidth + rowIdx * cellSize}
                    width={cellSize - 1}
                    height={cellSize - 1}
                    rx={3}
                    fill={
                      rowIdx === colIdx
                        ? "hsl(var(--border))"
                        : `hsl(var(--chart-1) / ${Math.min(value * 1.5, 0.85)})`
                    }
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + (rowIdx * classes.length + colIdx) * 0.002, duration: 0.3 }}
                    onMouseEnter={() => setHovered({ row: rowIdx, col: colIdx })}
                    onMouseLeave={() => setHovered(null)}
                    stroke={hovered?.row === rowIdx && hovered?.col === colIdx ? "white" : "none"}
                    strokeWidth={hovered?.row === rowIdx && hovered?.col === colIdx ? 2 : 0}
                    className="cursor-pointer"
                  />
                  {cellSize >= 30 && rowIdx !== colIdx && value >= 0.1 && (
                    <text
                      x={labelWidth + colIdx * cellSize + cellSize / 2 - 0.5}
                      y={labelWidth + rowIdx * cellSize + cellSize / 2 + 3}
                      textAnchor="middle"
                      fill={value >= 0.3 ? "white" : "hsl(var(--muted-foreground))"}
                      fontSize={8}
                      pointerEvents="none"
                    >
                      {value.toFixed(2)}
                    </text>
                  )}
                </g>
              ))
            )}
          </svg>

          {/* Hover tooltip */}
          {hovered && hovered.row !== hovered.col && (
            <Card className="absolute top-2 right-2 px-3 py-2 shadow-lg">
              <p className="font-semibold text-sm">
                P({classes[hovered.col]} | {classes[hovered.row]})
              </p>
              <p className="font-mono text-primary text-lg">
                {matrix[hovered.row][hovered.col].toFixed(3)}
              </p>
            </Card>
          )}
        </motion.div>
      </div>
    </SlideShell>
  );
}
