"use client";

import SlideShell from "@/components/pitch/slide-shell";
import { MajorityVoteScene } from "@/components/deck/majority-vote-scene";
import { mlpcDeckData } from "@/lib/mlpc-deck-data";

export function SlideMlpcAggregation() {
  const share = mlpcDeckData.aggregation?.singleAnnotatorShare ?? 0.17;

  return (
    <SlideShell title="Label aggregation" className="col-span-3">
      <div className="col-span-3 mx-auto flex w-full max-w-4xl flex-col gap-6">
        <MajorityVoteScene />

        <p className="text-sm text-muted-foreground">
          ~{(share * 100).toFixed(0)}% of files have a single annotator —
          those labels pass through directly after binarization, without
          majority arbitration.
        </p>
      </div>
    </SlideShell>
  );
}
