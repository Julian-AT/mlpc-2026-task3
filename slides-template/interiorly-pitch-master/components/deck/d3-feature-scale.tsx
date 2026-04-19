"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import * as d3 from "d3";
import { mlpcDeckData } from "@/lib/mlpc-deck-data";
import { Button } from "@/components/ui/button";

const W = 460;
const H = 260;
const PAD = { top: 30, right: 20, bottom: 40, left: 100 };

export function D3FeatureScale() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [normalized, setNormalized] = useState(false);
  const stats = mlpcDeckData.features.stats;

  const drawChart = useCallback(() => {
    const svg = d3.select(svgRef.current);
    if (!svg.node()) return;
    svg.selectAll("*").remove();

    const yScale = d3
      .scaleBand()
      .domain(stats.map((s) => s.feature))
      .range([PAD.top, H - PAD.bottom])
      .padding(0.2);

    const values = normalized
      ? stats.map((s) => ({
          feature: s.feature,
          low: -2,
          high: 2,
          mean: 0,
        }))
      : stats.map((s) => ({
          feature: s.feature,
          low: s.min,
          high: s.max,
          mean: s.mean,
        }));

    const allVals = values.flatMap((v) => [v.low, v.high]);
    const xScale = d3
      .scaleLinear()
      .domain([Math.min(...allVals, 0), Math.max(...allVals)])
      .range([PAD.left, W - PAD.right])
      .nice();

    const xAxis = svg
      .append("g")
      .attr("transform", `translate(0,${H - PAD.bottom})`)
      .call(d3.axisBottom(xScale).ticks(6));
    xAxis
      .selectAll("text")
      .style("fill", "hsl(var(--muted-foreground))")
      .style("font-size", "10px");
    xAxis.selectAll("line, path").style("stroke", "hsl(var(--border))");

    const yAxis = svg
      .append("g")
      .attr("transform", `translate(${PAD.left},0)`)
      .call(d3.axisLeft(yScale));
    yAxis
      .selectAll("text")
      .style("fill", "hsl(var(--muted-foreground))")
      .style("font-size", "10px");
    yAxis.selectAll("line, path").style("stroke", "hsl(var(--border))");

    const barHeight = yScale.bandwidth();

    const bars = svg
      .selectAll(".range-bar")
      .data(values)
      .enter()
      .append("rect")
      .attr("y", (d) => yScale(d.feature)!)
      .attr("height", barHeight)
      .attr("rx", 3);

    if (!normalized) {
      bars
        .attr("x", (d) => xScale(d.low))
        .attr("width", (d) => Math.max(1, xScale(d.high) - xScale(d.low)))
        .attr("fill", "hsl(var(--chart-1))")
        .attr("opacity", 0.7);
    } else {
      bars
        .attr("x", xScale(-2))
        .attr("width", xScale(2) - xScale(-2))
        .attr("fill", "hsl(var(--chart-2))")
        .attr("opacity", 0);

      bars
        .transition()
        .duration(800)
        .ease(d3.easeCubicInOut)
        .attr("opacity", 0.7);
    }

    const means = svg
      .selectAll(".mean-mark")
      .data(values)
      .enter()
      .append("line")
      .attr("y1", (d) => yScale(d.feature)!)
      .attr("y2", (d) => yScale(d.feature)! + barHeight)
      .attr("stroke", "hsl(var(--foreground))")
      .attr("stroke-width", 2)
      .attr("opacity", 0);

    if (!normalized) {
      means
        .attr("x1", (d) => xScale(d.mean))
        .attr("x2", (d) => xScale(d.mean))
        .transition()
        .duration(600)
        .delay(300)
        .attr("opacity", 0.8);
    } else {
      means
        .attr("x1", xScale(0))
        .attr("x2", xScale(0))
        .transition()
        .duration(600)
        .delay(300)
        .attr("opacity", 0.8);
    }

    svg
      .append("text")
      .attr("x", W / 2)
      .attr("y", H - 4)
      .attr("text-anchor", "middle")
      .style("fill", "hsl(var(--muted-foreground))")
      .style("font-size", "10px")
      .text(
        normalized
          ? "z-score (standardized)"
          : "raw scale (min–max range, | = mean)",
      );
  }, [stats, normalized]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setNormalized((n) => !n)}
        >
          {normalized ? "Show raw scales" : "Apply z-score normalization"}
        </Button>
        <span className="text-xs text-muted-foreground">
          {normalized
            ? "All features centered at 0, unit variance"
            : "Power ranges to 11,140 — Flatness stays in [0,1]"}
        </span>
      </div>
      <svg ref={svgRef} width={W} height={H} className="max-w-full" />
    </div>
  );
}
