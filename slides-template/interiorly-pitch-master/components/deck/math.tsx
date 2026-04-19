"use client";

import "katex/dist/katex.min.css";
import { BlockMath as KaTeXBlock, InlineMath as KaTeXInline } from "react-katex";
import { cn } from "@/lib/utils";

export function InlineMath({
  math,
  className,
}: {
  math: string;
  className?: string;
}) {
  return (
    <span className={cn("inline-block align-middle", className)}>
      <KaTeXInline math={math} />
    </span>
  );
}

export function BlockMath({
  math,
  className,
}: {
  math: string;
  className?: string;
}) {
  return (
    <div className={cn("overflow-x-auto py-1 text-center text-sm md:text-base", className)}>
      <KaTeXBlock math={math} />
    </div>
  );
}
