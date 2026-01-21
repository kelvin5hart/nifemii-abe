"use client";

import Image from "next/image";

const instagramPosts = [
  { image: "/images/IMG_1596.jpg", alt: "Evening elegance outfit" },
  { image: "/images/IMG_1597.jpg", alt: "Bridal collection piece" },
  { image: "/images/IMG_1598.jpg", alt: "Traditional royalty design" },
  { image: "/images/IMG_1599.jpg", alt: "Corporate chic attire" },
  { image: "/images/IMG_1601.jpg", alt: "Celebration wear" },
  { image: "/images/IMG_1605.jpg", alt: "Casual luxe fashion" },
  { image: "/images/IMG_1610.jpg", alt: "Custom design" },
  { image: "/images/IMG_1612.jpg", alt: "Fashion showcase" },
];

interface InstagramFeedProps {
  limit?: number;
}

export default function InstagramFeed({ limit = 8 }: InstagramFeedProps) {
  const posts = instagramPosts.slice(0, limit);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2">
        {posts.map((post, index) => (
          <a
            key={index}
            href="https://instagram.com/nifemiiabe"
            target="_blank"
            rel="noopener noreferrer"
            className="aspect-square relative overflow-hidden group"
          >
            <Image
              src={post.image}
              alt={post.alt}
              fill
              className="object-cover object-top group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-[#0a0a0a]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
          </a>
        ))}
      </div>
      <div className="text-center">
        <a
          href="https://instagram.com/nifemiiabe"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[#c9a962] text-sm tracking-[0.1em] uppercase font-[family-name:var(--font-montserrat)] hover:text-[#e5d4a1] transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
          </svg>
          Follow @nifemiiabe on Instagram
        </a>
      </div>
    </div>
  );
}
