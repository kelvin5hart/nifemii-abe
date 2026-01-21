"use client";

import { useState, useEffect, useCallback } from "react";

const testimonials = [
  {
    quote:
      "Nifemii Abe transformed my vision into reality. The attention to detail and craftsmanship is unparalleled. I felt like royalty on my wedding day.",
    name: "Adaeze Okonkwo",
    title: "Bride, Lagos",
    initials: "AO",
  },
  {
    quote:
      "The agbada Nifemii created for my traditional wedding was beyond my expectations. The quality of the fabric and the intricate embroidery made me stand out. Highly recommended!",
    name: "Chukwuemeka Obi",
    title: "Groom, Abuja",
    initials: "CO",
  },
  {
    quote:
      "I've been a client for 3 years now. Every piece I've ordered has been perfect. The consultation process is thorough and the delivery is always on time. True professionalism!",
    name: "Funke Adeyemi",
    title: "Loyal Client, Lagos",
    initials: "FA",
  },
  {
    quote:
      "Coordinating aso-ebi for my sister's wedding was stressful until I found Nifemii Abe. They handled everything seamlessly and all 50 guests looked stunning!",
    name: "Bukola Ibrahim",
    title: "Wedding Party, Port Harcourt",
    initials: "BI",
  },
  {
    quote:
      "As someone based in the UK, I was skeptical about ordering custom outfits from Nigeria. Nifemii Abe exceeded all expectations - from virtual consultations to international delivery. The fit was perfect and the quality speaks for itself. I've already recommended them to all my friends!",
    name: "Tolu Ogundimu",
    title: "International Client, London",
    initials: "TO",
  },
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Main testimonial card */}
      <div className="bg-[#0f0f0f] border border-[#1a1a1a] p-8 sm:p-12 relative min-h-[280px] flex flex-col justify-between">
        {/* Quote icon */}
        <svg
          className="w-10 h-10 sm:w-12 sm:h-12 text-[#c9a962]/20 absolute top-6 right-6"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>

        {/* Stars */}
        <div className="flex mb-4 sm:mb-6">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="w-4 h-4 sm:w-5 sm:h-5 text-[#c9a962]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Quote */}
        <blockquote className="text-[#e0e0e0] text-base sm:text-lg md:text-xl font-[family-name:var(--font-cormorant)] leading-relaxed mb-6 sm:mb-8 italic">
          &ldquo;{currentTestimonial.quote}&rdquo;
        </blockquote>

        {/* Author */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#c9a962]/20 flex items-center justify-center">
            <span className="text-[#c9a962] text-base font-[family-name:var(--font-cormorant)] font-semibold">
              {currentTestimonial.initials}
            </span>
          </div>
          <div>
            <p className="text-[#f5f5f5] text-sm sm:text-base font-[family-name:var(--font-montserrat)]">
              {currentTestimonial.name}
            </p>
            <p className="text-[#888888] text-xs sm:text-sm font-[family-name:var(--font-montserrat)]">
              {currentTestimonial.title}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-12 w-10 h-10 sm:w-12 sm:h-12 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#c9a962] transition-colors flex items-center justify-center group"
        aria-label="Previous testimonial"
      >
        <svg
          className="w-5 h-5 text-[#888888] group-hover:text-[#c9a962] transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-12 w-10 h-10 sm:w-12 sm:h-12 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#c9a962] transition-colors flex items-center justify-center group"
        aria-label="Next testimonial"
      >
        <svg
          className="w-5 h-5 text-[#888888] group-hover:text-[#c9a962] transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-[#c9a962] w-6"
                : "bg-[#2a2a2a] hover:bg-[#c9a962]/50"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
