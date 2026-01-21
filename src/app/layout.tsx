import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nifemiiabe.com"),
  title: {
    default: "Nifemii Abe | Bespoke Fashion Designer in Lagos, Nigeria",
    template: "%s | Nifemii Abe",
  },
  description: "Luxury bespoke fashion designer in Lagos, Nigeria. Custom made outfits, ready to wear collections, wedding attire, traditional Nigerian fashion, and style consultations. Transform your vision into wearable art.",
  keywords: [
    "fashion designer Lagos",
    "bespoke fashion Nigeria",
    "custom outfits Lagos",
    "Nigerian wedding attire",
    "ready to wear Lagos",
    "traditional Nigerian fashion",
    "aso-oke designer",
    "agbada designer",
    "bridal designer Lagos",
    "Nigerian fashion designer",
    "custom tailor Lagos",
    "luxury fashion Nigeria",
  ],
  authors: [{ name: "Nifemii Abe" }],
  creator: "Nifemii Abe",
  openGraph: {
    title: "Nifemii Abe | Bespoke Fashion Designer in Lagos, Nigeria",
    description: "Luxury bespoke fashion designer in Lagos, Nigeria. Custom made outfits, ready to wear collections, wedding attire, and style consultations.",
    type: "website",
    locale: "en_NG",
    siteName: "Nifemii Abe",
    images: [
      {
        url: "/images/nifemi_founder.jpg",
        width: 1200,
        height: 630,
        alt: "Nifemii Abe - Fashion Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nifemii Abe | Bespoke Fashion Designer",
    description: "Luxury bespoke fashion designer in Lagos, Nigeria. Custom made outfits, wedding attire, and style consultations.",
    images: ["/images/nifemi_founder.jpg"],
    creator: "@nifemiiabe",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Nifemii Abe",
  description: "Luxury bespoke fashion designer specializing in custom made outfits, ready to wear collections, wedding attire, and style consultations.",
  image: "/images/nifemi_founder.jpg",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lagos",
    addressCountry: "NG",
  },
  telephone: "+2347067601656",
  email: "nifemiiabe@gmail.com",
  url: "https://nifemiiabe.com",
  sameAs: [
    "https://instagram.com/nifemiiabe",
    "https://twitter.com/nifemiiabe",
  ],
  priceRange: "$$",
  openingHours: "Mo-Sa 09:00-18:00",
  serviceArea: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: 6.5244,
      longitude: 3.3792,
    },
    geoRadius: "50000",
  },
  makesOffer: [
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Custom Made Outfits",
        description: "Bespoke designs tailored to your unique measurements and style preferences.",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Wedding Consultations",
        description: "Comprehensive wedding consultations for brides, grooms, and wedding parties.",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Ready to Wear",
        description: "Curated collections of elegant pieces ready for immediate purchase.",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Style Consultations",
        description: "Personal style assessment and wardrobe planning services.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://nifemiiabe.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${cormorant.variable} ${montserrat.variable} antialiased`}
        suppressHydrationWarning
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
