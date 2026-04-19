"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import * as d3 from "d3";
import { mlpcDeckData, CLASS_COLOR } from "@/lib/mlpc-deck-data";

const W = 520;
const H = 400;
const PAD = { top: 10, right: 50, bottom: 30, left: 150 };

export function D3AgreementChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [animated, setAnimated] = useState(false);

  const sorted = useMemo(
    () =>
      [...mlpcDeckData.agreement.perClassIou]
        .sort((a, b) => b.iou - a.iou)
        .map((r) => ({
          cls: r.class,
          name: r.class.replaceAll("_", " "),
          iou: r.iou,
        })),
    [],
  );

  const drawChart = useCallback(() => {
    const svg = d3.select(svgRef.current);
    if (!svg.node()) return;
    svg.selectAll("*").remove();

    const yScale = d3
      .scaleBand()
      .domain(sorted.map((s) => s.name))
      .range([PAD.top, H - PAD.bottom])
      .padding(0.15);

    const xScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([PAD.left, W - PAD.right]);

    const xAxis = svg
      .append("g")
      .attr("transform", `translate(0,${H - PAD.bottom})`)
      .call(d3.axisBottom(xScale).ticks(5));
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

    const bars = svg
      .selectAll(".iou-bar")
      .data(sorted)
      .enter()
      .append("rect")
      .attr("y", (d) => yScale(d.name)!)
      .attr("height", yScale.bandwidth())
      .attr("x", PAD.left)
      .attr("rx", 3)
      .attr("fill", (d) => CLASS_COLOR[d.cls] ?? "hsl(var(--primary))")
      .attr("opacity", 0.8);

    if (!animated) {
      bars
        .attr("width", 0)
        .transition()
        .duration(800)
        .delay((_d, i) => i * 50)
        .ease(d3.easeCubicOut)
        .attr("width", (d) => Math.max(0, xScale(d.iou) - PAD.left));
      setAnimated(true);
    } else {
      bars.attr("width", (d) => Math.max(0, xScale(d.iou) - PAD.left));
    }

    const labels = svg
      .selectAll(".val-label")
      .data(sorted)
      .enter()
      .append("text")
      .attr("y", (d) => yScale(d.name)! + yScale.bandwidth() / 2 + 3)
      .style("fill", "hsl(var(--foreground))")
      .style("font-size", "9px")
      .style("font-family", "monospace")
      .text((d) => d.iou.toFixed(3));

    if (!animated) {
      labels
        .attr("x", PAD.left + 4)
        .attr("opacity", 0)
        .transition()
        .duration(400)
        .delay((_d, i) => 800 + i * 50)
        .attr("x", (d) => xScale(d.iou) + 4)
        .attr("opacity", 1);
    } else {
      labels.attr("x", (d) => xScale(d.iou) + 4).attr("opacity", 1);
    }
  }, [sorted, animated]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  return <svg ref={svgRef} width={W} height={H} className="max-w-full" />;
}
