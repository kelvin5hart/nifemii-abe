"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    id: 1,
    name: "Geometric Kaftan Set",
    description: "Beige kaftan with bold black geometric pattern. Modern senator style with matching trousers.",
    price: 85000,
    image: "/images/outfit1.jpg",
    category: "Kaftan",
    sizes: ["M", "L", "XL", "XXL"],
    color: "Beige/Black",
  },
  {
    id: 2,
    name: "Sage Minimalist Senator",
    description: "Clean sage green senator with subtle pocket detail. Short sleeve design perfect for casual elegance.",
    price: 65000,
    image: "/images/outfit2.jpg",
    category: "Senator",
    sizes: ["M", "L", "XL", "XXL"],
    color: "Sage Green",
  },
  {
    id: 3,
    name: "Teal Contrast Kaftan",
    description: "Sophisticated teal kaftan with white chest panel. Three-quarter sleeve design with side slits.",
    price: 75000,
    image: "/images/outfit3.jpg",
    category: "Kaftan",
    sizes: ["M", "L", "XL", "XXL"],
    color: "Teal/White",
  },
  {
    id: 4,
    name: "Rose Senator Set",
    description: "Elegant dusty rose senator with decorative stitch detailing. Short sleeve with matching trousers.",
    price: 68000,
    image: "/images/outfit4.jpg",
    category: "Senator",
    sizes: ["M", "L", "XL", "XXL"],
    color: "Dusty Rose",
  },
  {
    id: 5,
    name: "Olive Embroidered Kaftan",
    description: "Rich olive kaftan with intricate shoulder embroidery. Premium fabric with matching trousers.",
    price: 95000,
    image: "/images/outfit5.jpg",
    category: "Kaftan",
    sizes: ["M", "L", "XL", "XXL"],
    color: "Olive",
  },
  {
    id: 6,
    name: "Ankara Cuff Senator",
    description: "Lime green senator with vibrant Ankara cuff details. Long sleeve design with traditional touch.",
    price: 78000,
    image: "/images/outfit6.jpg",
    category: "Senator",
    sizes: ["M", "L", "XL", "XXL"],
    color: "Lime Green",
  },
  {
    id: 7,
    name: "Urban Print Kaftan",
    description: "Bold black and white abstract print kaftan. Contemporary design with solid black sleeves and trousers.",
    price: 72000,
    image: "/images/outfit7.jpg",
    category: "Kaftan",
    sizes: ["M", "L", "XL", "XXL"],
    color: "Black/White",
  },
  {
    id: 8,
    name: "Artisan Portrait Kaftan",
    description: "Statement brown kaftan with hand-painted artistic portrait. Unique piece for special occasions.",
    price: 120000,
    image: "/images/outfit8.jpg",
    category: "Kaftan",
    sizes: ["M", "L", "XL", "XXL"],
    color: "Brown",
  },
  {
    id: 9,
    name: "Abstract Art Top Set",
    description: "Black oversized top with colorful abstract art detail. Modern silhouette with matching trousers.",
    price: 82000,
    image: "/images/outfit9.jpg",
    category: "Contemporary",
    sizes: ["M", "L", "XL", "XXL"],
    color: "Black",
  },
  {
    id: 10,
    name: "Velvet Pearl Senator",
    description: "Luxurious navy blue velvet senator with pearl embellishments. Perfect for evening events.",
    price: 110000,
    image: "/images/outfit10.jpg",
    category: "Senator",
    sizes: ["M", "L", "XL", "XXL"],
    color: "Navy Blue",
  },
];

const categories = ["All", "Senator", "Kaftan", "Contemporary"];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
};

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);

  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter((item) => item.category === activeCategory);

  const handleInquiry = (product: typeof products[0]) => {
    const message = `Hi, I'm interested in purchasing the "${product.name}" (${product.color}) - ${formatPrice(product.price)}. Please let me know the available sizes and how to proceed.`;
    const whatsappUrl = `https://wa.me/2347067601656?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/outfit5.jpg"
            alt="Shop background"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/90 to-[#0a0a0a]" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <p className="text-[#c9a962] text-[10px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-3 sm:mb-4 font-[family-name:var(--font-montserrat)]">
            Ready to Wear
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-[#f5f5f5] font-[family-name:var(--font-cormorant)] mb-4 sm:mb-6">
            Shop Collection
          </h1>
          <div className="divider" />
          <p className="text-[#888888] text-sm sm:text-base mt-4 sm:mt-6 max-w-2xl mx-auto font-[family-name:var(--font-montserrat)]">
            Discover our ready-to-wear collection of premium Nigerian menswear.
            Each piece is crafted with attention to detail and available for immediate purchase.
          </p>
        </div>
      </section>

      {/* Category Filter */}
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

      {/* Products Grid */}
      <section className="py-8 sm:py-16 px-4 sm:px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="aspect-[3/4] relative overflow-hidden mb-2 sm:mb-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-[#c9a962]/90 px-2 py-0.5 sm:px-3 sm:py-1">
                    <span className="text-[8px] sm:text-xs text-[#0a0a0a] font-[family-name:var(--font-montserrat)] uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <p className="text-[#c9a962] text-sm sm:text-lg font-[family-name:var(--font-montserrat)] font-medium">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5] group-hover:text-[#c9a962] transition-colors">
                  {product.name}
                </h3>
                <p className="text-[#888888] text-[10px] sm:text-xs font-[family-name:var(--font-montserrat)] mt-0.5 sm:mt-1">
                  {product.color}
                </p>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[#888888] font-[family-name:var(--font-montserrat)]">
                No products found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-[#0a0a0a]/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-[#1a1a1a] max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-[3/4] relative">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="p-6 sm:p-8 flex flex-col">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="self-end text-[#888888] hover:text-[#f5f5f5] transition-colors mb-4"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <p className="text-[#c9a962] text-xs tracking-[0.2em] uppercase font-[family-name:var(--font-montserrat)] mb-2">
                  {selectedProduct.category}
                </p>
                <h2 className="text-2xl sm:text-3xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-2">
                  {selectedProduct.name}
                </h2>
                <p className="text-2xl text-[#c9a962] font-[family-name:var(--font-montserrat)] mb-4">
                  {formatPrice(selectedProduct.price)}
                </p>

                <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)] mb-6 leading-relaxed">
                  {selectedProduct.description}
                </p>

                <div className="mb-4">
                  <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] mb-2">
                    Color: <span className="text-[#888888]">{selectedProduct.color}</span>
                  </p>
                </div>

                <div className="mb-6">
                  <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] mb-2">
                    Available Sizes:
                  </p>
                  <div className="flex gap-2">
                    {selectedProduct.sizes.map((size) => (
                      <span
                        key={size}
                        className="px-3 py-1 border border-[#2a2a2a] text-[#888888] text-sm font-[family-name:var(--font-montserrat)]"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto space-y-3">
                  <button
                    onClick={() => handleInquiry(selectedProduct)}
                    className="w-full bg-[#c9a962] text-[#0a0a0a] py-3 text-sm tracking-[0.1em] uppercase font-[family-name:var(--font-montserrat)] hover:bg-[#e5d4a1] transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Order via WhatsApp
                  </button>
                  <p className="text-[#888888] text-xs text-center font-[family-name:var(--font-montserrat)]">
                    Contact us to confirm size availability and arrange payment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-[#0f0f0f]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 mx-auto mb-4 border border-[#c9a962] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-2">
                Nationwide Delivery
              </h3>
              <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                We deliver across Nigeria. International shipping available on request.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-4 border border-[#c9a962] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-2">
                Quality Guaranteed
              </h3>
              <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                Premium fabrics and expert craftsmanship in every piece.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-4 border border-[#c9a962] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-2">
                Secure Payment
              </h3>
              <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                Bank transfer or cash payment. 50% deposit to confirm order.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/outfit8.jpg"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#f5f5f5] font-[family-name:var(--font-cormorant)] mb-4 sm:mb-6">
            Looking for Something Custom?
          </h2>
          <p className="text-[#888888] text-sm sm:text-base font-[family-name:var(--font-montserrat)] mb-6 sm:mb-8">
            We can create a custom piece tailored to your exact measurements and style preferences.
          </p>
          <Link href="/contact" className="btn-primary text-xs sm:text-sm">
            Book a Consultation
          </Link>
        </div>
      </section>
    </>
  );
}
