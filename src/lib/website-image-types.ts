import { Timestamp } from "firebase/firestore";

// Image categories for website sections
export type ImageCategory =
  | "hero" // Homepage hero carousel
  | "about-hero" // About page hero
  | "about-gallery" // About page gallery
  | "about-founder" // Founder photo
  | "services" // Services page cards
  | "collections" // Collections page grid
  | "shop-hero" // Shop page hero
  | "backgrounds"; // Background images (testimonials, CTA)

// Website image document structure
export interface WebsiteImage {
  id: string;
  category: ImageCategory;
  url: string;
  name: string;
  order: number;
  createdAt: Date | Timestamp;
  updatedAt?: Date | Timestamp;
}

// Default images for each category (fallbacks)
export const defaultImages: Record<ImageCategory, string[]> = {
  hero: [
    "/images/IMG_1606.jpg",
    "/images/IMG_1607.jpg",
    "/images/IMG_1608.jpg",
    "/images/IMG_1609.jpg",
    "/images/wedding_01.jpg",
    "/images/wedding_02.jpg",
    "/images/wedding_03.jpg",
    "/images/Traditional.jpg",
    "/images/design_final.jpg",
  ],
  "about-hero": ["/images/IMG_1606.jpg"],
  "about-gallery": [
    "/images/IMG_1618.jpg",
    "/images/IMG_1619.jpg",
    "/images/IMG_1620.jpg",
    "/images/IMG_1596.jpg",
  ],
  "about-founder": ["/images/nifemi_founder.jpg"],
  services: [
    "/images/design_final.jpg",
    "/images/Traditional.jpg",
    "/images/wedding_01.jpg",
    "/images/nifemi_founder.jpg",
  ],
  collections: [
    "/images/IMG_1596.jpg",
    "/images/wedding_01.jpg",
    "/images/Traditional.jpg",
    "/images/IMG_1599.jpg",
    "/images/IMG_1601.jpg",
    "/images/IMG_1605.jpg",
    "/images/IMG_1618.jpg",
    "/images/IMG_1619.jpg",
    "/images/IMG_1620.jpg",
    "/images/wedding_02.jpg",
    "/images/wedding_03.jpg",
    "/images/design_final.jpg",
    "/images/IMG_1597.jpg",
    "/images/IMG_1598.jpg",
    "/images/IMG_1610.jpg",
  ],
  "shop-hero": ["/images/outfit5.jpg"],
  backgrounds: [
    "/images/IMG_1610.jpg", // Testimonials
    "/images/IMG_1616.jpg", // CTA sections
  ],
};

// Category display names for admin UI
export const categoryDisplayNames: Record<ImageCategory, string> = {
  hero: "Homepage Hero Carousel",
  "about-hero": "About Page Hero",
  "about-gallery": "About Page Gallery",
  "about-founder": "Founder Photo",
  services: "Services Page",
  collections: "Collections Page",
  "shop-hero": "Shop Page Hero",
  backgrounds: "Background Images",
};

// Category descriptions for admin UI
export const categoryDescriptions: Record<ImageCategory, string> = {
  hero: "Images that rotate in the homepage hero section (recommended: 5-9 images)",
  "about-hero": "Main hero background image for the About page",
  "about-gallery": "Gallery grid on the About page (recommended: 4 images)",
  "about-founder": "Profile photo of the founder/designer",
  services: "Images for each service card (Custom Made, Ready to Wear, Wedding, Style)",
  collections: "Collection preview images (recommended: 12-15 images)",
  "shop-hero": "Hero background image for the Shop page",
  backgrounds: "Background images for testimonials and CTA sections",
};
