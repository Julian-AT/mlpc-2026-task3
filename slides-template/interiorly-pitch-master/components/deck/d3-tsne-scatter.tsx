"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import * as d3 from "d3";
import { mlpcDeckData, CLASS_COLOR } from "@/lib/mlpc-deck-data";

export function D3TsneScatter({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [animated, setAnimated] = useState(false);
  const [activeClass, setActiveClass] = useState<string | null>(null);
  const points = mlpcDeckData.tsne.points;

  const w = 420;
  const h = 300;
  const pad = 24;

  const scales = useMemo(() => {
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    return {
      x: d3
        .scaleLinear()
        .domain([Math.min(...xs) - 1, Math.max(...xs) + 1])
        .range([pad, w - pad]),
      y: d3
        .scaleLinear()
        .domain([Math.min(...ys) - 1, Math.max(...ys) + 1])
        .range([h - pad, pad]),
    };
  }, [points]);

  const classes = useMemo(
    () => [...new Set(points.map((p) => p.class))],
    [points],
  );

  const animateEntrance = useCallback(() => {
    const svg = d3.select(svgRef.current);
    if (!svg.node()) return;

    svg.selectAll(".tsne-point").remove();

    const centerX = w / 2;
    const centerY = h / 2;

    svg
      .selectAll(".tsne-point")
      .data(points)
      .enter()
      .append("circle")
      .attr("class", "tsne-point")
      .attr("cx", centerX)
      .attr("cy", centerY)
      .attr("r", 0)
      .attr("fill", (d) => CLASS_COLOR[d.class] ?? "hsl(var(--primary))")
      .attr("opacity", 0)
      .transition()
      .duration(1200)
      .delay((_d, i) => 200 + i * 2)
      .ease(d3.easeCubicOut)
      .attr("cx", (d) => scales.x(d.x))
      .attr("cy", (d) => scales.y(d.y))
      .attr("r", 3)
      .attr("opacity", 0.75);
  }, [points, scales, w, h]);

  useEffect(() => {
    if (!animated) {
      animateEntrance();
      setAnimated(true);
    } else {
      const svg = d3.select(svgRef.current);
      svg.selectAll(".tsne-point").remove();
      svg
        .selectAll(".tsne-point")
        .data(points)
        .enter()
        .append("circle")
        .attr("class", "tsne-point")
        .attr("cx", (d) => scales.x(d.x))
        .attr("cy", (d) => scales.y(d.y))
        .attr("r", 3)
        .attr("fill", (d) => CLASS_COLOR[d.class] ?? "hsl(var(--primary))")
        .attr("opacity", 0.75);
    }
  }, [animated, animateEntrance, points, scales]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg
      .selectAll<SVGCircleElement, (typeof points)[number]>(".tsne-point")
      .transition()
      .duration(300)
      .attr("opacity", (d) =>
        activeClass === null || d.class === activeClass ? 0.8 : 0.08,
      )
      .attr("r", (d) =>
        activeClass === null ? 3 : d.class === activeClass ? 4 : 2,
      );
  }, [activeClass]);

  return (
    <div className={className}>
      <svg
        ref={svgRef}
        width={w}
        height={h}
        className="max-w-full rounded-md border bg-muted/20"
      />
      <div className="mt-2 flex flex-wrap gap-1">
        {classes.map((cls) => (
          <button
            key={cls}
            type="button"
            className="rounded px-1.5 py-0.5 text-[9px] transition-opacity"
            style={{
              backgroundColor: CLASS_COLOR[cls] ?? "gray",
              color: "#fff",
              opacity: activeClass === null || activeClass === cls ? 1 : 0.3,
            }}
            onClick={() => setActiveClass((c) => (c === cls ? null : cls))}
          >
            {cls.replaceAll("_", " ")}
          </button>
        ))}
      </div>
    </div>
  );
}
