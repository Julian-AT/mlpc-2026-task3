"use client";

import "mafs/core.css";
import {
  Coordinates,
  Mafs,
  Polyline,
  Text,
  Theme,
  useMovablePoint,
} from "mafs";
import { AnimatedMetric } from "@/components/deck/animated-metric";
import { BlockMath } from "@/components/deck/math";
import { Card } from "@/components/ui/card";

function intervalIoU(a: [number, number], b: [number, number]) {
  const [a0, a1] = [Math.min(a[0], a[1]), Math.max(a[0], a[1])];
  const [b0, b1] = [Math.min(b[0], b[1]), Math.max(b[0], b[1])];
  const inter = Math.max(0, Math.min(a1, b1) - Math.max(a0, b0));
  const union = a1 - a0 + b1 - b0 - inter;
  return union > 0 ? inter / union : 0;
}

export function IouIntervalMafs() {
  const pA0 = useMovablePoint([1.2, 0], { constrain: "horizontal", color: Theme.blue });
  const pA1 = useMovablePoint([4.2, 0], { constrain: "horizontal", color: Theme.blue });
  const pB0 = useMovablePoint([3.4, 0], { constrain: "horizontal", color: Theme.orange });
  const pB1 = useMovablePoint([7.1, 0], { constrain: "horizontal", color: Theme.orange });

  const a: [number, number] = [pA0.x, pA1.x];
  const b: [number, number] = [pB0.x, pB1.x];
  const iou = intervalIoU(a, b);

  const ya = 0.45;
  const yb = -0.45;
  const a0 = Math.min(a[0], a[1]);
  const a1 = Math.max(a[0], a[1]);
  const b0 = Math.min(b[0], b[1]);
  const b1 = Math.max(b[0], b[1]);

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Card className="overflow-hidden border-border/80 bg-card/60 p-3">
        <div className="h-[260px] w-full">
          <Mafs viewBox={{ x: [-0.5, 10.5], y: [-1.15, 1.15] }}>
            <Coordinates.Cartesian subdivisions={2} />
            <Polyline
              points={[
                [a0, ya],
                [a1, ya],
              ]}
              color={Theme.blue}
              weight={4}
            />
            <Polyline
              points={[
                [b0, yb],
                [b1, yb],
              ]}
              color={Theme.orange}
              weight={4}
            />
            {pA0.element}
            {pA1.element}
            {pB0.element}
            {pB1.element}
            <Text x={0.2} y={0.95} size={0.14} color={Theme.foreground}>
              Drag endpoints — IoU updates live
            </Text>
          </Mafs>
        </div>
      </Card>
      <div className="flex flex-col justify-center gap-3 text-sm">
        <BlockMath math="\mathrm{IoU}=\frac{|A \cap B|}{|A \cup B|}" />
        <Card className="border-border/80 bg-muted/30 px-4 py-3 font-mono text-lg">
          IoU = <AnimatedMetric value={iou} decimals={3} />
        </Card>
        <p className="text-muted-foreground">
          Segment-level agreement pairs binary masks per class; this 1D toy model is the same
          intersection-over-union idea on two intervals.
        </p>
      </div>
    </div>
  );
}
