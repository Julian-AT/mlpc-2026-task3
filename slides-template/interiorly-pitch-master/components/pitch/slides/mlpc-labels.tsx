"use client";

import SlideShell from "@/components/pitch/slide-shell";
import { D3ClassFrequency } from "@/components/deck/d3-class-frequency";

export function SlideMlpcLabels() {
  return (
    <SlideShell title="Label space" className="col-span-3">
      <div className="col-span-3 mx-auto flex w-full max-w-3xl flex-col gap-4">
        <D3ClassFrequency />

        <p className="text-sm text-muted-foreground">
          Footsteps dominates (~15.3 %); light_switch is rarest (~0.6 %) — a
          24:1 ratio. Multi-label output requires per-class sigmoid heads, not
          softmax.
        </p>
      </div>
    </SlideShell>
  );
}
