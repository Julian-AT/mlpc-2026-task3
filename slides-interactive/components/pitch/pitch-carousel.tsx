"use client";

import React, { useEffect, useState, memo } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Slides } from "@/components/pitch/slides";
import { CarouselToolbar } from "@/components/pitch/carousel-toolbar";
import { useCurrentSlide } from "@/lib/hooks/use-current-slide";

interface PitchCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  slides: (keyof typeof Slides)[];
}

const CarouselSlide = memo(({ slide }: { slide: keyof typeof Slides }) => {
  if (!Slides[slide]) return null;
  return Slides[slide];
});
CarouselSlide.displayName = "CarouselSlide";

const PitchCarousel = ({ slides }: PitchCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const { currentSlide, setCurrentSlide } = useCurrentSlide();

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrentSlide(api.selectedScrollSnap() + 1);
    };

    setCurrentSlide(currentSlide || api.selectedScrollSnap() + 1);
    api.scrollTo(currentSlide - 1);
    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api, currentSlide, setCurrentSlide]);

  return (
    <Carousel className="relative min-h-full w-full" setApi={setApi}>
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={`${slide}-${index}`}>
            <CarouselSlide slide={slide} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselToolbar api={api} totalSlides={slides.length} />
    </Carousel>
  );
};

export default memo(PitchCarousel);
