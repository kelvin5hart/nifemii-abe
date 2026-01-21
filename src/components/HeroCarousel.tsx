"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const heroImages = [
  "/images/IMG_1606.jpg",
  "/images/IMG_1607.jpg",
  "/images/IMG_1608.jpg",
  "/images/IMG_1609.jpg",
  "/images/wedding_01.jpg",
  "/images/wedding_02.jpg",
  "/images/wedding_03.jpg",
  "/images/Traditional.jpg",
  "/images/design_final.jpg",
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

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
