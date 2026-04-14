"use client";

import { motion } from "framer-motion";
import { useHotkeys } from "react-hotkeys-hook";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconChevronLeft, IconChevronRight } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type CarouselToolbarProps = {
  api: any;
  totalSlides?: number;
};

export function CarouselToolbar({ api, totalSlides = 15 }: CarouselToolbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => setMounted(true), []);
  useHotkeys("arrowRight", () => api?.scrollNext(), [api]);
  useHotkeys("arrowLeft", () => api?.scrollPrev(), [api]);

  useEffect(() => {
    if (!api) return;
    const handleSelect = () => setCurrentIndex(api.selectedScrollSnap());
    api.on("select", handleSelect);
    handleSelect();
    return () => api.off("select", handleSelect);
  }, [api]);

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 flex justify-center z-50"
      initial={{ y: "100%" }}
      animate={{ y: "0%" }}
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 200,
        delay: 0.2,
      }}
    >
      <TooltipProvider delayDuration={20}>
        <div className="flex h-12 items-center gap-3 border border-border/50 bg-card/80 px-4 backdrop-blur-xl md:mb-6 md:rounded-xl">
          {/* Team name */}
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            MLPC 2026
          </span>

          <Separator orientation="vertical" className="h-5" />

          {/* Slide counter */}
          <span className="font-mono text-xs tabular-nums text-muted-foreground min-w-[3.5rem] text-center">
            {currentIndex + 1} / {totalSlides}
          </span>

          <Separator orientation="vertical" className="h-5" />

          {/* Navigation */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  disabled={!api?.canScrollPrev}
                  className={cn(
                    "rounded-md p-1.5 transition-colors hover:bg-accent",
                    !api?.canScrollPrev && "opacity-30 pointer-events-none",
                  )}
                  onClick={() => api?.scrollPrev()}
                >
                  <IconChevronLeft className="h-4 w-4 text-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-xs" sideOffset={20}>
                Previous <kbd className="ml-1 rounded bg-muted px-1 font-mono text-[10px]">←</kbd>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  disabled={!api?.canScrollNext}
                  className={cn(
                    "rounded-md p-1.5 transition-colors hover:bg-accent",
                    !api?.canScrollNext && "opacity-30 pointer-events-none",
                  )}
                  onClick={() => api?.scrollNext()}
                >
                  <IconChevronRight className="h-4 w-4 text-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-xs" sideOffset={20}>
                Next <kbd className="ml-1 rounded bg-muted px-1 font-mono text-[10px]">→</kbd>
              </TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-5" />

          {/* Theme toggle */}
          {mounted && (
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-md p-1.5 transition-colors hover:bg-accent text-muted-foreground"
            >
              {theme === "dark" ? (
                <Moon className="h-3.5 w-3.5" />
              ) : (
                <Sun className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </div>
      </TooltipProvider>
    </motion.div>
  );
}
