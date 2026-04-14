"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";

export function IoUVisualization() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [segA, setSegA] = useState({ start: 2, end: 8 });
  const [segB, setSegB] = useState({ start: 5, end: 11 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const draggingRef = useRef<string | null>(null);

  const width = 700;
  const height = 400;
  const margin = { top: 40, right: 40, bottom: 60, left: 40 };
  const barHeight = 40;
  const timelineLength = 14;

  const xScale = d3.scaleLinear()
    .domain([0, timelineLength])
    .range([margin.left, width - margin.right]);

  const intersection = Math.max(0, Math.min(segA.end, segB.end) - Math.max(segA.start, segB.start));
  const union = (segA.end - segA.start) + (segB.end - segB.start) - intersection;
  const iou = union > 0 ? intersection / union : 0;

  const handleMouseDown = useCallback((target: string) => {
    draggingRef.current = target;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggingRef.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const value = Math.round(xScale.invert(x) * 2) / 2;
    const clamped = Math.max(0, Math.min(timelineLength, value));

    if (draggingRef.current === "a-start") {
      setSegA(prev => ({ ...prev, start: Math.min(clamped, prev.end - 0.5) }));
    } else if (draggingRef.current === "a-end") {
      setSegA(prev => ({ ...prev, end: Math.max(clamped, prev.start + 0.5) }));
    } else if (draggingRef.current === "b-start") {
      setSegB(prev => ({ ...prev, start: Math.min(clamped, prev.end - 0.5) }));
    } else if (draggingRef.current === "b-end") {
      setSegB(prev => ({ ...prev, end: Math.max(clamped, prev.start + 0.5) }));
    }
  }, [xScale, timelineLength]);

  const handleMouseUp = useCallback(() => {
    draggingRef.current = null;
  }, []);

  useEffect(() => {
    if (hasAnimated) return;
    const timer = setTimeout(() => setHasAnimated(true), 300);
    return () => clearTimeout(timer);
  }, [hasAnimated]);

  const yA = 100;
  const yB = 180;
  const intStart = Math.max(segA.start, segB.start);
  const intEnd = Math.min(segA.end, segB.end);
  const hasIntersection = intersection > 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-[700px] select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Timeline axis */}
        <line
          x1={margin.left} y1={height - margin.bottom}
          x2={width - margin.right} y2={height - margin.bottom}
          stroke="hsl(var(--muted-foreground))" strokeWidth={1}
        />
        {Array.from({ length: timelineLength + 1 }, (_, i) => (
          <g key={i}>
            <line
              x1={xScale(i)} y1={height - margin.bottom - 4}
              x2={xScale(i)} y2={height - margin.bottom + 4}
              stroke="hsl(var(--muted-foreground))" strokeWidth={1}
            />
            <text
              x={xScale(i)} y={height - margin.bottom + 20}
              textAnchor="middle" fill="hsl(var(--muted-foreground))"
              fontSize={11}
            >{i}s</text>
          </g>
        ))}

        {/* Labels */}
        <text x={margin.left - 5} y={yA + barHeight / 2 + 4} textAnchor="end" fill="hsl(var(--chart-1))" fontSize={13} fontWeight="bold">A</text>
        <text x={margin.left - 5} y={yB + barHeight / 2 + 4} textAnchor="end" fill="hsl(var(--chart-2))" fontSize={13} fontWeight="bold">B</text>

        {/* Annotator A segment */}
        <rect
          x={xScale(segA.start)} y={yA}
          width={xScale(segA.end) - xScale(segA.start)} height={barHeight}
          fill="hsl(var(--chart-1))" fillOpacity={0.4} stroke="hsl(var(--chart-1))" strokeWidth={2}
          rx={4}
          style={{ transition: hasAnimated ? "none" : "all 0.8s ease-out" }}
        />

        {/* Annotator B segment */}
        <rect
          x={xScale(segB.start)} y={yB}
          width={xScale(segB.end) - xScale(segB.start)} height={barHeight}
          fill="hsl(var(--chart-2))" fillOpacity={0.4} stroke="hsl(var(--chart-2))" strokeWidth={2}
          rx={4}
          style={{ transition: hasAnimated ? "none" : "all 0.8s ease-out" }}
        />

        {/* Intersection highlight */}
        {hasIntersection && (
          <>
            <rect
              x={xScale(intStart)} y={yA}
              width={xScale(intEnd) - xScale(intStart)} height={barHeight}
              fill="hsl(var(--chart-3))" fillOpacity={0.6} rx={4}
            />
            <rect
              x={xScale(intStart)} y={yB}
              width={xScale(intEnd) - xScale(intStart)} height={barHeight}
              fill="hsl(var(--chart-3))" fillOpacity={0.6} rx={4}
            />
            <line x1={xScale(intStart)} y1={yA + barHeight} x2={xScale(intStart)} y2={yB} stroke="hsl(var(--chart-3))" strokeWidth={1} strokeDasharray="4 2" />
            <line x1={xScale(intEnd)} y1={yA + barHeight} x2={xScale(intEnd)} y2={yB} stroke="hsl(var(--chart-3))" strokeWidth={1} strokeDasharray="4 2" />
          </>
        )}

        {/* Drag handles for A */}
        <circle cx={xScale(segA.start)} cy={yA + barHeight / 2} r={7} fill="hsl(var(--chart-1))" stroke="white" strokeWidth={2} cursor="ew-resize" onMouseDown={() => handleMouseDown("a-start")} />
        <circle cx={xScale(segA.end)} cy={yA + barHeight / 2} r={7} fill="hsl(var(--chart-1))" stroke="white" strokeWidth={2} cursor="ew-resize" onMouseDown={() => handleMouseDown("a-end")} />

        {/* Drag handles for B */}
        <circle cx={xScale(segB.start)} cy={yB + barHeight / 2} r={7} fill="hsl(var(--chart-2))" stroke="white" strokeWidth={2} cursor="ew-resize" onMouseDown={() => handleMouseDown("b-start")} />
        <circle cx={xScale(segB.end)} cy={yB + barHeight / 2} r={7} fill="hsl(var(--chart-2))" stroke="white" strokeWidth={2} cursor="ew-resize" onMouseDown={() => handleMouseDown("b-end")} />

        {/* Union bracket */}
        <line
          x1={xScale(Math.min(segA.start, segB.start))} y1={yB + barHeight + 20}
          x2={xScale(Math.max(segA.end, segB.end))} y2={yB + barHeight + 20}
          stroke="hsl(var(--muted-foreground))" strokeWidth={2}
        />
        <text
          x={(xScale(Math.min(segA.start, segB.start)) + xScale(Math.max(segA.end, segB.end))) / 2}
          y={yB + barHeight + 38}
          textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize={11}
        >Union = {union.toFixed(1)}s</text>

        {/* Intersection bracket */}
        {hasIntersection && (
          <>
            <line
              x1={xScale(intStart)} y1={yA - 15}
              x2={xScale(intEnd)} y2={yA - 15}
              stroke="hsl(var(--chart-3))" strokeWidth={2}
            />
            <text
              x={(xScale(intStart) + xScale(intEnd)) / 2}
              y={yA - 22}
              textAnchor="middle" fill="hsl(var(--chart-3))" fontSize={11}
            >Intersection = {intersection.toFixed(1)}s</text>
          </>
        )}
      </svg>

      {/* Formula */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card/50 px-6 py-4 backdrop-blur-sm">
        <span className="text-lg text-muted-foreground">IoU =</span>
        <div className="flex flex-col items-center">
          <span className="border-b border-muted-foreground px-2 text-lg font-mono text-chart-3">
            |A ∩ B| = {intersection.toFixed(1)}
          </span>
          <span className="px-2 text-lg font-mono text-muted-foreground">
            |A ∪ B| = {union.toFixed(1)}
          </span>
        </div>
        <span className="text-lg text-muted-foreground">=</span>
        <span className={`text-3xl font-bold font-mono ${iou >= 0.75 ? "text-chart-3" : iou >= 0.5 ? "text-chart-2" : "text-chart-4"}`}>
          {iou.toFixed(3)}
        </span>
      </div>

      <p className="text-xs text-muted-foreground">Drag the handles to adjust segment boundaries</p>
    </div>
  );
}
