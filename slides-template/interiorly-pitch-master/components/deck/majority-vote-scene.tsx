"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { BlockMath } from "@/components/deck/math";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const initVotes = [1, 0, 1] as const;

export function MajorityVoteScene() {
  const [votes, setVotes] = useState<number[]>([...initVotes]);
  const [threshold, setThreshold] = useState(0.5);

  const mean = useMemo(
    () =>
      votes.length ? votes.reduce((a, b) => a + b, 0) / votes.length : 0,
    [votes],
  );
  const aggregated = mean >= threshold ? 1 : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-3">
        <BlockMath math="y_{t,c}=\mathbf{1}\left[\frac{1}{A}\sum_{a=1}^{A}\mathbf{1}[\mathrm{ann}_{t,c,a}\ge 0.5]\ge 0.5\right]" />
        <p className="text-xs text-muted-foreground">
          Toggle each annotator&apos;s binarized vote for one segment/class
          pair, then watch the majority label flip at the threshold line.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Vote threshold
          </span>
          {[0.4, 0.5, 0.6].map((t) => (
            <Button
              key={t}
              type="button"
              size="sm"
              variant={threshold === t ? "default" : "outline"}
              onClick={() => setThreshold(t)}
            >
              {t}
            </Button>
          ))}
        </div>
      </div>
      <Card className="space-y-3 border-border/80 bg-card/60 p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Annotators</span>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setVotes([...initVotes])}
          >
            Reset
          </Button>
        </div>
        <div className="flex gap-2">
          {votes.map((v, i) => (
            <Button
              key={i}
              type="button"
              variant="outline"
              className={cn(
                "h-14 flex-1 text-sm font-medium transition-colors",
                v
                  ? "border-primary bg-primary/15 text-primary hover:bg-primary/20"
                  : "border-border bg-muted/40 hover:bg-muted/60",
              )}
              onClick={() =>
                setVotes((prev) =>
                  prev.map((x, j) => (j === i ? (x ? 0 : 1) : x)),
                )
              }
            >
              A{i + 1}: {v ? "1" : "0"}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-md border bg-background/80 p-2">
            <div className="text-muted-foreground">Mean vote</div>
            <motion.div
              key={mean}
              initial={{ opacity: 0.4, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-lg"
            >
              {mean.toFixed(3)}
            </motion.div>
          </div>
          <div className="rounded-md border bg-background/80 p-2">
            <div className="text-muted-foreground">Aggregated label</div>
            <motion.div
              key={aggregated}
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              className="font-mono text-lg font-semibold"
            >
              {aggregated}
            </motion.div>
          </div>
        </div>
      </Card>
    </div>
  );
}
