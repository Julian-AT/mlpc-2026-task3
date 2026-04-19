"use client";

import SlideShell from "@/components/pitch/slide-shell";
import { D3FeatureScale } from "@/components/deck/d3-feature-scale";

export function SlideMlpcFeatures() {
  return (
    <SlideShell title="Feature scales" className="col-span-3">
      <div className="col-span-3 mx-auto flex w-full max-w-3xl flex-col gap-4">
        <D3FeatureScale />

        <p className="text-sm text-muted-foreground">
          Power ranges to 11,140 while flatness and ZCR stay below 1. Toggle
          to z-scores — per-feature normalization is essential before any
          distance-based classifier.
        </p>
      </div>
    </SlideShell>
  );
}
