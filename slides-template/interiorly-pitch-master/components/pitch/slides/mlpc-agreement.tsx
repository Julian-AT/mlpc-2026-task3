"use client";

import SlideShell from "@/components/pitch/slide-shell";
import { mlpcDeckData } from "@/lib/mlpc-deck-data";
import { D3AgreementChart } from "@/components/deck/d3-agreement-chart";

export function SlideMlpcAgreement() {
  return (
    <SlideShell title="Annotator agreement (IoU)" className="col-span-3">
      <div className="col-span-3 mx-auto flex w-full max-w-3xl flex-col gap-4">
        <D3AgreementChart />

        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 text-sm text-muted-foreground">
          <span>
            Overall mean:{" "}
            <strong className="font-mono text-foreground">
              {mlpcDeckData.agreement.overall.toFixed(3)}
            </strong>
          </span>
          <span>
            Own pairs:{" "}
            <strong className="font-mono text-foreground">
              {mlpcDeckData.agreement.ownPairs.mean.toFixed(3)}
            </strong>{" "}
            (n={mlpcDeckData.agreement.ownPairs.n.toLocaleString()})
          </span>
          <span>
            External:{" "}
            <strong className="font-mono text-foreground">
              {mlpcDeckData.agreement.otherPairs.mean.toFixed(3)}
            </strong>{" "}
            (n={mlpcDeckData.agreement.otherPairs.n.toLocaleString()})
          </span>
        </div>
      </div>
    </SlideShell>
  );
}
