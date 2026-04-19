"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import * as d3 from "d3";
import { mlpcDeckData } from "@/lib/mlpc-deck-data";

const CELL = 30;

export function D3CorrelationHeatmap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [animated, setAnimated] = useState(false);
  const [hover, setHover] = useState<{
    i: number;
    j: number;
    val: number;
  } | null>(null);

  const { labels, matrix } = mlpcDeckData.features.correlation;
  const n = labels.length;
  const pad = { top: 90, left: 90 };
  const w = pad.left + n * CELL + 8;
  const h = pad.top + n * CELL + 8;

  const colorScale = useCallback((v: number) => {
    if (v >= 0) return d3.interpolateBlues(v);
    return d3.interpolateReds(-v);
  }, []);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    if (!svg.node()) return;

    svg.selectAll(".cell").remove();

    const cells = svg
      .selectAll(".cell")
      .data(
        matrix.flatMap((row, i) => row.map((val, j) => ({ i, j, val }))),
      )
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("x", (d) => pad.left + d.j * CELL)
      .attr("y", (d) => pad.top + d.i * CELL)
      .attr("width", CELL - 1)
      .attr("height", CELL - 1)
      .attr("rx", 2)
      .attr("fill", (d) => colorScale(d.val))
      .attr("opacity", 0)
      .style("cursor", "pointer")
      .on("mouseenter", function (_e, d) {
        setHover({ i: d.i, j: d.j, val: d.val });
        d3.select(this)
          .attr("stroke", "hsl(var(--primary))")
          .attr("stroke-width", 2);
      })
      .on("mouseleave", function () {
        setHover(null);
        d3.select(this).attr("stroke", "none");
      });

    if (!animated) {
      cells
        .transition()
        .duration(600)
        .delay((d) => (d.i + d.j) * 20)
        .attr("opacity", 1);
      setAnimated(true);
    } else {
      cells.attr("opacity", 1);
    }
  }, [matrix, pad.left, pad.top, colorScale, animated]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    if (hover) {
      svg
        .selectAll<SVGRectElement, { i: number; j: number }>(".cell")
        .attr("opacity", (d) =>
          d.i === hover.i || d.j === hover.j ? 1 : 0.2,
        );
    } else {
      svg.selectAll(".cell").attr("opacity", 1);
    }
  }, [hover]);

  return (
    <div className="space-y-2">
      <svg
        ref={svgRef}
        width={w}
        height={h}
        className="max-w-full overflow-visible"
      >
        {labels.map((lab, k) => (
          <text
            key={`lx-${k}`}
            x={pad.left + k * CELL + CELL / 2}
            y={pad.top - 8}
            textAnchor="end"
            transform={`rotate(-42 ${pad.left + k * CELL + CELL / 2} ${pad.top - 8})`}
            style={{
              fill: "hsl(var(--muted-foreground))",
              fontSize: "10px",
            }}
          >
            {lab}
          </text>
        ))}
        {labels.map((lab, k) => (
          <text
            key={`ly-${k}`}
            x={pad.left - 8}
            y={pad.top + k * CELL + CELL / 2 + 3}
            textAnchor="end"
            style={{
              fill: "hsl(var(--muted-foreground))",
              fontSize: "10px",
            }}
          >
            {lab}
          </text>
        ))}
      </svg>
      {hover && (
        <div className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">
            {labels[hover.i]}
          </span>
          {" vs "}
          <span className="font-medium text-foreground">
            {labels[hover.j]}
          </span>
          {": "}
          <span className="font-mono tabular-nums text-foreground">
            r = {hover.val.toFixed(3)}
          </span>
        </div>
      )}
    </div>
  );
}
