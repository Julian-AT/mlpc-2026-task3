"use client";

import SlideShell from "@/components/pitch/slide-shell";
import { mlpcDeckData } from "@/lib/mlpc-deck-data";
import { D3DeviceChart } from "@/components/deck/d3-device-chart";

export function SlideMlpcMetadata() {
  const m = mlpcDeckData.metadata;

  return (
    <SlideShell title="Recording metadata" className="col-span-3">
      <div className="col-span-3 mx-auto flex w-full max-w-3xl flex-col gap-4">
        <div className="flex flex-wrap gap-x-8 gap-y-1 text-sm text-muted-foreground">
          <span>
            <strong className="font-mono text-foreground">
              {mlpcDeckData.agreement.totalRecordings.toLocaleString()}
            </strong>{" "}
            recordings
          </span>
          <span>
            Median duration{" "}
            <strong className="font-mono text-foreground">
              {m.medianDurationSec} s
            </strong>
          </span>
          <span>
            <strong className="font-mono text-foreground">
              {m.uniqueDevices}
            </strong>{" "}
            devices
          </span>
        </div>

        <D3DeviceChart />

        <p className="text-sm text-muted-foreground">
          Kitchen-heavy skew (~26 %) mechanically over-represents
          kitchen-associated classes.
        </p>
      </div>
    </SlideShell>
  );
}
