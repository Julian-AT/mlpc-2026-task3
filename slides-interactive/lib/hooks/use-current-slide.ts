"use client";

import { useCallback } from "react";
import { parseAsInteger, useQueryState } from "nuqs";

const TOTAL_SLIDES = 15;

export function useCurrentSlide() {
  const [currentSlide, _setCurrentSlide] = useQueryState(
    "slide",
    parseAsInteger.withOptions({ shallow: true }).withDefault(1),
  );

  const setCurrentSlide = useCallback(
    (slideNumber: number) => {
      if (slideNumber === currentSlide) return;
      if (slideNumber < 1) slideNumber = 1;
      if (slideNumber > TOTAL_SLIDES) slideNumber = TOTAL_SLIDES;
      _setCurrentSlide(slideNumber);
    },
    [_setCurrentSlide, currentSlide],
  );

  return { currentSlide, setCurrentSlide };
}
