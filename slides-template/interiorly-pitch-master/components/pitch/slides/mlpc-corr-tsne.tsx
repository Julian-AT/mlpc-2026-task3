"use client";

import SlideShell from "@/components/pitch/slide-shell";
import { D3CorrelationHeatmap } from "@/components/deck/d3-correlation-heatmap";

export function SlideMlpcCorrTsne() {
  return (
    <SlideShell title="Feature correlations" className="col-span-3">
      <div className="col-span-3 mx-auto flex w-full max-w-3xl flex-col gap-4">
        <D3CorrelationHeatmap />

        <p className="text-sm text-muted-foreground">
          Energy–flux <em>r</em> = 0.93; MFCC–log-mel <em>r</em> = 0.82. ZCR,
          centroid, bandwidth, and rolloff form a spectral-shape cluster (
          <em>r</em> &gt; 0.6). Delta/delta-delta MFCCs are nearly independent
          — a temporal-dynamics subspace.
        </p>
      </div>
    </SlideShell>
  );
}
