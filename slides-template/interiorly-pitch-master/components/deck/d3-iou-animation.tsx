"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import * as d3 from "d3";

const SET_A: number[] = [0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0];
const SET_B: number[] = [0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0];

export function D3IouAnimation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [step, setStep] = useState(0);

  const w = 400;
  const h = 200;
  const segCount = 12;
  const segW = 24;
  const segH = 32;
  const gap = 3;
  const baseX = (w - segCount * (segW + gap)) / 2;
  const rowA = 55;
  const rowB = 105;

  const { inter, union, interCount, unionCount, iou } = useMemo(() => {
    const i: number[] = SET_A.map((a, idx) => (a && SET_B[idx] ? 1 : 0));
    const u: number[] = SET_A.map((a, idx) => (a || SET_B[idx] ? 1 : 0));
    const ic = i.reduce((s, v) => s + v, 0);
    const uc = u.reduce((s, v) => s + v, 0);
    return { inter: i, union: u, interCount: ic, unionCount: uc, iou: uc > 0 ? ic / uc : 0 };
  }, []);

  const drawScene = useCallback(() => {
    const svg = d3.select(svgRef.current);
    if (!svg.node()) return;
    svg.selectAll("*").remove();

    svg
      .append("text")
      .attr("x", baseX - 4)
      .attr("y", rowA + segH / 2 + 4)
      .attr("text-anchor", "end")
      .attr("class", "fill-muted-foreground")
      .style("font-size", "11px")
      .text("A");

    svg
      .append("text")
      .attr("x", baseX - 4)
      .attr("y", rowB + segH / 2 + 4)
      .attr("text-anchor", "end")
      .attr("class", "fill-muted-foreground")
      .style("font-size", "11px")
      .text("B");

    for (let t = 0; t < segCount; t++) {
      svg
        .append("text")
        .attr("x", baseX + t * (segW + gap) + segW / 2)
        .attr("y", rowA - 8)
        .attr("text-anchor", "middle")
        .attr("class", "fill-muted-foreground")
        .style("font-size", "9px")
        .text(`t${t + 1}`);
    }

    const segsA = svg
      .selectAll(".seg-a")
      .data(SET_A)
      .enter()
      .append("rect")
      .attr("class", "seg-a")
      .attr("x", (_d, i) => baseX + i * (segW + gap))
      .attr("y", rowA)
      .attr("width", segW)
      .attr("height", segH)
      .attr("rx", 3)
      .attr("fill", (d) => (d ? "hsl(220, 70%, 55%)" : "hsl(220, 10%, 85%)"))
      .attr("opacity", 0);

    segsA
      .transition()
      .duration(300)
      .delay((_d, i) => i * 40)
      .attr("opacity", (d) => (d ? 0.8 : 0.2));

    const segsB = svg
      .selectAll(".seg-b")
      .data(SET_B)
      .enter()
      .append("rect")
      .attr("class", "seg-b")
      .attr("x", (_d, i) => baseX + i * (segW + gap))
      .attr("y", rowB)
      .attr("width", segW)
      .attr("height", segH)
      .attr("rx", 3)
      .attr("fill", (d) => (d ? "hsl(145, 60%, 45%)" : "hsl(145, 10%, 85%)"))
      .attr("opacity", 0);

    segsB
      .transition()
      .duration(300)
      .delay((_d, i) => i * 40 + 200)
      .attr("opacity", (d) => (d ? 0.8 : 0.2));

    if (step >= 1) {
      inter.forEach((v, i) => {
        if (v) {
          svg
            .append("rect")
            .attr("x", baseX + i * (segW + gap) - 1)
            .attr("y", rowA - 2)
            .attr("width", segW + 2)
            .attr("height", rowB + segH - rowA + 4)
            .attr("rx", 4)
            .attr("fill", "none")
            .attr("stroke", "hsl(40, 90%, 50%)")
            .attr("stroke-width", 2)
            .attr("opacity", 0)
            .transition()
            .duration(400)
            .delay(i * 60)
            .attr("opacity", 0.9);
        }
      });
    }

    if (step >= 2) {
      union.forEach((v, i) => {
        if (v && !inter[i]) {
          svg
            .append("rect")
            .attr("x", baseX + i * (segW + gap) - 1)
            .attr("y", rowA - 2)
            .attr("width", segW + 2)
            .attr("height", rowB + segH - rowA + 4)
            .attr("rx", 4)
            .attr("fill", "none")
            .attr("stroke", "hsl(0, 60%, 55%)")
            .attr("stroke-width", 1.5)
            .attr("stroke-dasharray", "4,2")
            .attr("opacity", 0)
            .transition()
            .duration(400)
            .delay(i * 60)
            .attr("opacity", 0.7);
        }
      });
    }

    if (step >= 2) {
      const resultY = rowB + segH + 24;
      const resultText = svg
        .append("text")
        .attr("x", w / 2)
        .attr("y", resultY)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-family", "KaTeX_Math, serif")
        .attr("class", "fill-foreground")
        .attr("opacity", 0);

      resultText.text(
        `IoU = |A ∩ B| / |A ∪ B| = ${interCount} / ${unionCount} = ${iou.toFixed(3)}`,
      );

      resultText.transition().duration(600).delay(400).attr("opacity", 1);
    }
  }, [step, baseX, segW, segH, gap, rowA, rowB, inter, union, interCount, unionCount, iou, w]);

  useEffect(() => {
    drawScene();
  }, [drawScene]);

  return (
    <div className="space-y-2">
      <svg ref={svgRef} width={w} height={h} className="max-w-full" />
      <div className="flex gap-2">
        {["Show annotations", "Highlight intersection", "Compute IoU"].map(
          (label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(i)}
              className={`rounded-md border px-2 py-1 text-[10px] font-medium transition-colors ${
                step === i
                  ? "border-primary bg-primary/10 text-primary"
                  : "hover:bg-accent"
              }`}
            >
              {label}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
