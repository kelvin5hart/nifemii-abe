"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const collections = [
  {
    id: 1,
    title: "Evening Elegance",
    category: "Ready to Wear",
    description: "Sophisticated evening wear for special occasions",
    image: "/images/IMG_1596.jpg",
  },
  {
    id: 2,
    title: "Bridal Collection",
    category: "Wedding",
    description: "Timeless bridal pieces for your special day",
    image: "/images/wedding_01.jpg",
  },
  {
    id: 3,
    title: "Traditional Royalty",
    category: "Traditional",
    description: "Nigerian traditional attire with a modern twist",
    image: "/images/Traditional.jpg",
  },
  {
    id: 4,
    title: "Corporate Chic",
    category: "Ready to Wear",
    description: "Professional attire that makes a statement",
    image: "/images/IMG_1599.jpg",
  },
  {
    id: 5,
    title: "Celebration Wear",
    category: "Custom",
    description: "Festive outfits for celebrations and parties",
    image: "/images/IMG_1601.jpg",
  },
  {
    id: 6,
    title: "Casual Luxe",
    category: "Ready to Wear",
    description: "Elevated everyday wear with attention to detail",
    image: "/images/IMG_1605.jpg",
  },
  {
    id: 7,
    title: "Aso-Oke Collection",
    category: "Traditional",
    description: "Handwoven traditional fabrics reimagined",
    image: "/images/IMG_1618.jpg",
  },
  {
    id: 8,
    title: "Groom Collection",
    category: "Wedding",
    description: "Distinguished attire for the modern groom",
    image: "/images/IMG_1619.jpg",
  },
  {
    id: 9,
    title: "Ankara Fusion",
    category: "Custom",
    description: "Contemporary designs with African prints",
    image: "/images/IMG_1620.jpg",
  },
  {
    id: 10,
    title: "White Wedding",
    category: "Wedding",
    description: "Elegant white wedding gowns and dresses",
    image: "/images/wedding_02.jpg",
  },
  {
    id: 11,
    title: "Reception Glam",
    category: "Wedding",
    description: "Show-stopping reception and after-party looks",
    image: "/images/wedding_03.jpg",
  },
  {
    id: 12,
    title: "Bespoke Masterpiece",
    category: "Custom",
    description: "One-of-a-kind custom creations tailored to perfection",
    image: "/images/design_final.jpg",
  },
  {
    id: 13,
    title: "Red Carpet Ready",
    category: "Ready to Wear",
    description: "Statement pieces for your most glamorous moments",
    image: "/images/IMG_1597.jpg",
  },
  {
    id: 14,
    title: "Heritage Couture",
    category: "Traditional",
    description: "Celebrating African heritage through exquisite design",
    image: "/images/IMG_1598.jpg",
  },
  {
    id: 15,
    title: "Minimalist Elegance",
    category: "Custom",
    description: "Clean lines and sophisticated simplicity",
    image: "/images/IMG_1610.jpg",
  },
];

const categories = ["All", "Ready to Wear", "Custom", "Wedding", "Traditional"];

export default function Collections() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCollections = activeCategory === "All"
    ? collections
    : collections.filter((item) => item.category === activeCategory);

  return (
    <>
      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/IMG_1606.jpg"
            alt="Collections background"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/90 to-[#0a0a0a]" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <p className="text-[#c9a962] text-[10px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-3 sm:mb-4 font-[family-name:var(--font-montserrat)]">
            Our Portfolio
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-[#f5f5f5] font-[family-name:var(--font-cormorant)] mb-4 sm:mb-6">
            Collections
          </h1>
          <div className="divider" />
          <p className="text-[#888888] text-sm sm:text-base mt-4 sm:mt-6 max-w-2xl mx-auto font-[family-name:var(--font-montserrat)]">
            Explore our carefully curated collections, each piece crafted with meticulous
            attention to detail and a passion for elegance.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-4 sm:py-8 px-4 sm:px-6 bg-[#0a0a0a] border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 sm:px-6 py-1.5 sm:py-2 text-[10px] sm:text-sm tracking-[0.05em] sm:tracking-[0.1em] font-[family-name:var(--font-montserrat)] uppercase transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-[#c9a962] text-[#0a0a0a]"
                    : "border border-[#2a2a2a] text-[#888888] hover:border-[#c9a962] hover:text-[#c9a962]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-8 sm:py-16 px-4 sm:px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {filteredCollections.map((collection) => (
              <div
                key={collection.id}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/4] relative overflow-hidden mb-2 sm:mb-4">
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    className="object-cover object-top group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
                  <div className="absolute inset-0 bg-[#0a0a0a]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center p-3 sm:p-6">
                      <p className="text-[#c9a962] text-[10px] sm:text-sm tracking-[0.1em] sm:tracking-[0.2em] uppercase font-[family-name:var(--font-montserrat)] mb-1 sm:mb-2">
                        {collection.category}
                      </p>
                      <p className="text-[#f5f5f5] text-[10px] sm:text-sm font-[family-name:var(--font-montserrat)] hidden sm:block">
                        {collection.description}
                      </p>
                      <div className="mt-2 sm:mt-4">
                        <span className="text-[#c9a962] text-[10px] sm:text-sm tracking-[0.1em] sm:tracking-[0.2em] uppercase font-[family-name:var(--font-montserrat)] border border-[#c9a962] px-2 py-1 sm:px-4 sm:py-2 inline-block">
                          View Details
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-[#c9a962]/90 px-1.5 py-0.5 sm:px-3 sm:py-1">
                    <span className="text-[8px] sm:text-xs text-[#0a0a0a] font-[family-name:var(--font-montserrat)] uppercase tracking-wider">
                      {collection.category}
                    </span>
                  </div>
                </div>
                <h3 className="text-sm sm:text-lg lg:text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5] group-hover:text-[#c9a962] transition-colors">
                  {collection.title}
                </h3>
                <p className="text-[#888888] text-[10px] sm:text-sm font-[family-name:var(--font-montserrat)] mt-0.5 sm:mt-1 line-clamp-2 sm:line-clamp-none">
                  {collection.description}
                </p>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCollections.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[#888888] font-[family-name:var(--font-montserrat)]">
                No collections found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#0f0f0f] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/IMG_1616.jpg"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#f5f5f5] font-[family-name:var(--font-cormorant)] mb-4 sm:mb-6">
            Can&apos;t Find What You&apos;re Looking For?
          </h2>
          <p className="text-[#888888] text-sm sm:text-base font-[family-name:var(--font-montserrat)] mb-6 sm:mb-8">
            We specialize in creating custom pieces tailored to your unique vision.
            Let&apos;s discuss your dream outfit.
          </p>
          <Link href="/contact" className="btn-primary text-xs sm:text-sm">
            Book a Consultation
          </Link>
        </div>
      </section>
    </>
  );
}
