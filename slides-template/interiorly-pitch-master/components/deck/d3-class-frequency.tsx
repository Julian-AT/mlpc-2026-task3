"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import * as d3 from "d3";
import { mlpcDeckData, CLASS_COLOR } from "@/lib/mlpc-deck-data";

const W = 440;
const H = 340;
const PAD = { top: 10, right: 40, bottom: 20, left: 150 };

export function D3ClassFrequency() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [animated, setAnimated] = useState(false);

  const sorted = useMemo(
    () =>
      [...mlpcDeckData.labels.classSegments].sort(
        (a, b) => b.count - a.count,
      ),
    [],
  );

  const drawChart = useCallback(() => {
    const svg = d3.select(svgRef.current);
    if (!svg.node()) return;
    svg.selectAll("*").remove();

    const yScale = d3
      .scaleBand()
      .domain(sorted.map((s) => s.class))
      .range([PAD.top, H - PAD.bottom])
      .padding(0.15);

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(sorted, (d) => d.pct) ?? 1])
      .range([PAD.left, W - PAD.right])
      .nice();

    svg
      .append("g")
      .attr("transform", `translate(0,${H - PAD.bottom})`)
      .call(d3.axisBottom(xScale).ticks(5).tickFormat((v) => `${v}%`))
      .selectAll("text")
      .attr("class", "fill-muted-foreground")
      .style("font-size", "9px");

    svg
      .append("g")
      .attr("transform", `translate(${PAD.left},0)`)
      .call(
        d3.axisLeft(yScale).tickFormat((d) => d.replaceAll("_", " ")),
      )
      .selectAll("text")
      .attr("class", "fill-muted-foreground")
      .style("font-size", "9px");

    const bars = svg
      .selectAll(".freq-bar")
      .data(sorted)
      .enter()
      .append("rect")
      .attr("class", "freq-bar")
      .attr("y", (d) => yScale(d.class)!)
      .attr("height", yScale.bandwidth())
      .attr("x", PAD.left)
      .attr("rx", 3)
      .attr("fill", (d) => CLASS_COLOR[d.class] ?? "hsl(var(--primary))")
      .attr("opacity", 0.8);

    if (!animated) {
      bars
        .attr("width", 0)
        .transition()
        .duration(800)
        .delay((_d, i) => i * 50)
        .ease(d3.easeCubicOut)
        .attr("width", (d) => xScale(d.pct) - PAD.left);
      setAnimated(true);
    } else {
      bars.attr("width", (d) => xScale(d.pct) - PAD.left);
    }

    const labels = svg
      .selectAll(".pct-label")
      .data(sorted)
      .enter()
      .append("text")
      .attr("y", (d) => yScale(d.class)! + yScale.bandwidth() / 2 + 3)
      .attr("class", "fill-foreground")
      .style("font-size", "9px")
      .style("font-family", "monospace")
      .text((d) => `${d.pct.toFixed(1)}%`);

    if (!animated) {
      labels
        .attr("x", PAD.left + 4)
        .attr("opacity", 0)
        .transition()
        .duration(400)
        .delay((_d, i) => 800 + i * 50)
        .attr("x", (d) => xScale(d.pct) + 4)
        .attr("opacity", 1);
    } else {
      labels.attr("x", (d) => xScale(d.pct) + 4).attr("opacity", 1);
    }
  }, [sorted, animated]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  return <svg ref={svgRef} width={W} height={H} className="max-w-full" />;
}
