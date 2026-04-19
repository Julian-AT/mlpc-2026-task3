"use client";

import { useCallback } from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import { MLPC_SLIDE_COUNT } from "@/components/deck/outline";

export function useCurrentSlide() {
  const [currentSlide, _setCurrentSlide] = useQueryState(
    "slide",
    parseAsInteger.withOptions({ shallow: true }).withDefault(1),
  );

  const setCurrentSlide = useCallback(
    (slideNumber: number) => {
      if (slideNumber === currentSlide) return;
      if (slideNumber < 1) slideNumber = 1;
      if (slideNumber > MLPC_SLIDE_COUNT) slideNumber = MLPC_SLIDE_COUNT;

      _setCurrentSlide(slideNumber);
    },
    [_setCurrentSlide, currentSlide],
  );

  return {
    currentSlide,
    setCurrentSlide,
  };
}
