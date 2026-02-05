"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useWebsiteImages } from "@/hooks/useWebsiteImages";

export default function HeroCarousel() {
  const { images: heroImages, loading } = useWebsiteImages("hero");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (heroImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Reset index if images change and current index is out of bounds
  useEffect(() => {
    if (currentIndex >= heroImages.length && heroImages.length > 0) {
      setCurrentIndex(0);
    }
  }, [heroImages.length, currentIndex]);

  if (loading || heroImages.length === 0) {
    return (
      <div className="absolute inset-0 bg-[#0a0a0a]">
        {/* Show first default image as placeholder while loading */}
        <Image
          src="/images/IMG_1606.jpg"
          alt="Fashion showcase"
          fill
          className="object-cover object-[25%_top] scale-110"
          priority
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      {heroImages.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image}
            alt={`Fashion showcase ${index + 1}`}
            fill
            className="object-cover object-[25%_top] scale-110"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
}
