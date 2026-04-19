"use client";

import SlideShell from "@/components/pitch/slide-shell";
import { mlpcDeckData } from "@/lib/mlpc-deck-data";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function SlideMlpcCaseStudy() {
  const [highlight, setHighlight] = useState<"A" | "B" | null>(null);
  const cs = mlpcDeckData.caseStudy;
  if (!cs) return null;

  return (
    <SlideShell title="Case study · lowest agreement" className="col-span-3">
      <div className="col-span-3 mx-auto flex max-w-xl flex-col gap-6">
        <p className="text-muted-foreground">
          File <strong className="font-mono text-foreground">{cs.file}</strong>{" "}
          — two reviewers, polyphonic domestic audio. Agreement:{" "}
          <strong className="text-foreground">{cs.agreementPct}%</strong>.
        </p>

        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="text-xs uppercase">Class</TableHead>
                <TableHead className="text-xs uppercase">
                  <button
                    type="button"
                    className={cn(
                      "transition-colors",
                      highlight === "A" && "text-primary",
                    )}
                    onClick={() =>
                      setHighlight((h) => (h === "A" ? null : "A"))
                    }
                  >
                    Annotator A
                  </button>
                </TableHead>
                <TableHead className="text-xs uppercase">
                  <button
                    type="button"
                    className={cn(
                      "transition-colors",
                      highlight === "B" && "text-primary",
                    )}
                    onClick={() =>
                      setHighlight((h) => (h === "B" ? null : "B"))
                    }
                  >
                    Annotator B
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cs.rows.map((r) => (
                <TableRow key={r.class}>
                  <TableCell className="font-mono text-xs">
                    {r.class}
                  </TableCell>
                  <TableCell
                    className={cn(
                      highlight === "A" && "bg-primary/10",
                      r.annotatorA !== r.annotatorB &&
                        "font-semibold text-amber-600 dark:text-amber-400",
                    )}
                  >
                    {r.annotatorA}
                  </TableCell>
                  <TableCell
                    className={cn(
                      highlight === "B" && "bg-primary/10",
                      r.annotatorA !== r.annotatorB &&
                        "font-semibold text-amber-600 dark:text-amber-400",
                    )}
                  >
                    {r.annotatorB}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-medium">
                <TableCell>Total regions</TableCell>
                <TableCell
                  className={cn(highlight === "A" && "bg-primary/10")}
                >
                  {cs.totals.annotatorA}
                </TableCell>
                <TableCell
                  className={cn(highlight === "B" && "bg-primary/10")}
                >
                  {cs.totals.annotatorB}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-muted-foreground"
        >
          Overlapping sound classes mask each other acoustically — majority vote
          with only two annotators drops any event marked by exactly one
          reviewer.
        </motion.p>
      </div>
    </SlideShell>
  );
}
