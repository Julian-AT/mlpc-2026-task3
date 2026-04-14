import { SLIDE_URI_TITLE } from "@/config/pitch";
import { cn } from "@/lib/utils";
import React from "react";

interface SlideShellProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  children: React.ReactNode;
}

const SlideShell = ({ title, className, children }: SlideShellProps) => {
  return (
    <div className="relative flex min-h-screen w-screen flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-16 pt-10 pb-2">
        <span className="text-sm font-medium tracking-widest uppercase text-muted-foreground">
          {title}
        </span>
        <span className="text-xs text-muted-foreground/60 font-mono">
          {SLIDE_URI_TITLE}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center px-16 pb-20">
        <div
          className={cn(
            "grid w-full max-w-6xl grid-cols-1 items-start gap-8",
            className,
          )}
          id={title.toLowerCase().replace(/\s+/g, "-")}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default SlideShell;
