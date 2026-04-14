"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import slidesData from "@/data/slides-data.json";

const COLORS = slidesData.classColors as Record<string, string>;

interface Point {
  x: number;
  y: number;
  class: string;
  randomX: number;
  randomY: number;
}

export function TsneAnimation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const [hoveredClass, setHoveredClass] = useState<string | null>(null);

  const width = 700;
  const height = 420;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };

  const points: Point[] = useMemo(() =>
    slidesData.tsnePoints.map((p) => ({
      ...p,
      randomX: (Math.random() - 0.5) * (width - margin.left - margin.right) * 0.8,
      randomY: (Math.random() - 0.5) * (height - margin.top - margin.bottom) * 0.8,
    })),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  const xScale = useMemo(() => {
    const extent = d3.extent(points, (d) => d.x) as [number, number];
    return d3.scaleLinear()
      .domain([extent[0] - 3, extent[1] + 3])
      .range([margin.left, width - margin.right]);
  }, [points, margin.left, margin.right]);

  const yScale = useMemo(() => {
    const extent = d3.extent(points, (d) => d.y) as [number, number];
    return d3.scaleLinear()
      .domain([extent[0] - 3, extent[1] + 3])
      .range([height - margin.bottom, margin.top]);
  }, [points, margin.bottom, margin.top]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const uniqueClasses = useMemo(() =>
    Array.from(new Set(points.map((p) => p.class))),
  [points]);

  const replay = () => {
    setPhase(0);
    setTimeout(() => setPhase(1), 800);
    setTimeout(() => setPhase(2), 3500);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className={`px-2 py-0.5 rounded border ${phase >= 0 ? "border-primary text-primary" : "border-border"}`}>
          Random
        </span>
        <span>→</span>
        <span className={`px-2 py-0.5 rounded border ${phase >= 1 ? "border-primary text-primary" : "border-border"}`}>
          Transitioning
        </span>
        <span>→</span>
        <span className={`px-2 py-0.5 rounded border ${phase >= 2 ? "border-primary text-primary" : "border-border"}`}>
          t-SNE Clusters
        </span>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-[700px] rounded-xl border border-border bg-card/20"
      >
        {points.map((p, i) => {
          const cx = phase >= 2
            ? xScale(p.x)
            : phase >= 1
            ? xScale(p.x) * 0.3 + (width / 2 + p.randomX) * 0.7
            : width / 2 + p.randomX;
          const cy = phase >= 2
            ? yScale(p.y)
            : phase >= 1
            ? yScale(p.y) * 0.3 + (height / 2 + p.randomY) * 0.7
            : height / 2 + p.randomY;

          const isHighlighted = hoveredClass === null || hoveredClass === p.class;

          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={hoveredClass === p.class ? 5 : 3.5}
              fill={COLORS[p.class] || "#888"}
              fillOpacity={isHighlighted ? 0.85 : 0.15}
              stroke={hoveredClass === p.class ? "white" : "none"}
              strokeWidth={hoveredClass === p.class ? 1 : 0}
              style={{
                transition: phase >= 1
                  ? `cx 2.5s ease-out ${i * 5}ms, cy 2.5s ease-out ${i * 5}ms, fill-opacity 0.3s, r 0.2s`
                  : `fill-opacity 0.3s, r 0.2s`,
              }}
            />
          );
        })}

        {phase >= 2 && (
          <>
            <text x={xScale(-34.5)} y={yScale(27)} textAnchor="middle" fill="hsl(var(--chart-5))" fontSize={10} fontWeight="bold" opacity={0.8}>
              vacuum (tight)
            </text>
            <text x={xScale(29)} y={yScale(-18)} textAnchor="middle" fill="hsl(var(--chart-1))" fontSize={10} fontWeight="bold" opacity={0.8}>
              water (tight)
            </text>
            <text x={xScale(0)} y={yScale(7)} textAnchor="middle" fill="hsl(var(--chart-4))" fontSize={10} fontWeight="bold" opacity={0.8}>
              light_switch (dispersed)
            </text>
          </>
        )}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 justify-center max-w-[700px]">
        {uniqueClasses.map((cls) => (
          <button
            key={cls}
            className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] transition-colors ${
              hoveredClass === cls
                ? "border-primary bg-primary/10"
                : "border-border hover:bg-accent"
            }`}
            onMouseEnter={() => setHoveredClass(cls)}
            onMouseLeave={() => setHoveredClass(null)}
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: COLORS[cls] || "#888" }}
            />
            <span className="text-muted-foreground">{cls.replace(/_/g, " ")}</span>
          </button>
        ))}
      </div>

      {phase >= 2 && (
        <button
          onClick={replay}
          className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors"
        >
          Replay Animation
        </button>
      )}
    </div>
  );
}
