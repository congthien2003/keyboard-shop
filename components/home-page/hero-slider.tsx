"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSlide {
  id: number;
  image: string;
  alt: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image: "/images/hero-banner-7.webp",
    alt: "Trái cây tươi ngon",
  },
  {
    id: 2,
    image: "/images/hero-banner-13.webp",
    alt: "Trái cây nội địa chất lượng cao",
  },
  {
    id: 3,
    image: "/images/hero-banner-3.webp",
    alt: "Trái cây theo mùa",
  },
  {
    id: 4,
    image: "/images/hero-banner-11.webp",
    alt: "Trái cây hữu cơ",
  },
  {
    id: 5,
    image: "/images/hero-banner-12.webp",
    alt: "Trái cây đặc sản",
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative group">
      {/* Main slider container */}
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/15 to-accent/10 shadow-[0_24px_60px_-32px_oklch(0.3_0.07_155/0.65)]">
        {/* Slides */}
        <div className="relative h-full w-full">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                className="object-cover"
                priority={index === 0}
                fill
                sizes="100vw"
              />
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 border-primary/10 bg-card/85 opacity-0 backdrop-blur-sm transition-opacity duration-300 hover:bg-card group-hover:opacity-100 focus-visible:opacity-100"
          onClick={goToPrevious}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 border-primary/10 bg-card/85 opacity-0 backdrop-blur-sm transition-opacity duration-300 hover:bg-card group-hover:opacity-100 focus-visible:opacity-100"
          onClick={goToNext}
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <div
            className="h-full bg-accent transition-all duration-100 ease-linear"
            style={{
              width: isAutoPlaying ? "100%" : "0%",
              animation: isAutoPlaying ? "progress 4s linear infinite" : "none",
            }}
          />
        </div>
      </div>

      {/* Dots navigation */}
      <div className="flex justify-center gap-2 mt-6">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-accent scale-125"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Decorative elements */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-accent/20 blur-2xl" />
      <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
