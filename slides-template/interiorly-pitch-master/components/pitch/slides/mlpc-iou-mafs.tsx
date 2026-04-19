"use client";

import SlideShell from "@/components/pitch/slide-shell";
import { IouIntervalMafs } from "@/components/deck/iou-interval-mafs";

export function SlideMlpcIouMafs() {
  return (
    <SlideShell title="IoU — intersection over union" className="col-span-3">
      <div className="col-span-3 mx-auto w-full max-w-3xl">
        <IouIntervalMafs />
      </div>
    </SlideShell>
  );
}
