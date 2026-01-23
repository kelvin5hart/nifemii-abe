"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/lib/firebase-types";
import { useCart } from "@/contexts/CartContext";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
};

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const { addToCart } = useCart();

  useEffect(() => {
    // Fetch products from Firebase - filter active ones client-side to avoid index requirement
    const productsQuery = query(
      collection(db, "products"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(productsQuery, (snapshot) => {
      const allProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      // Filter active products client-side
      const activeProducts = allProducts.filter((p) => p.active);
      setProducts(activeProducts);

      // Extract unique categories from active products
      const uniqueCategories = ["All", ...new Set(activeProducts.map((p) => p.category).filter(Boolean))];
      setCategories(uniqueCategories);

      setLoading(false);
    }, (error) => {
      console.error("Error fetching products:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter((item) => item.category === activeCategory);

  const handleAddToCart = () => {
    if (!selectedProduct || !selectedSize) return;
    addToCart(selectedProduct, selectedSize);
    setSelectedProduct(null);
    setSelectedSize("");
  };

  const getAvailableSizes = (product: Product) => {
    return Object.entries(product.sizes)
      .filter(([, stock]) => stock > 0)
      .map(([size]) => size);
  };

  const isInStock = (product: Product) => {
    return Object.values(product.sizes).some((stock) => stock > 0);
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
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-[#c9a962] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <svg
                className="w-16 h-16 text-[#2a2a2a] mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-[#888888] font-[family-name:var(--font-montserrat)] mb-4">
                No products available in this category.
              </p>
              <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                Check back soon for new arrivals!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.id}`}
                  className="group cursor-pointer block"
                >
                  <div className="aspect-[3/4] relative overflow-hidden mb-2 sm:mb-4">
                    <Image
                      src={product.images[0] || "/images/placeholder.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent opacity-60" />

                    {/* Category Badge */}
                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-[#c9a962]/90 px-2 py-0.5 sm:px-3 sm:py-1">
                      <span className="text-[8px] sm:text-xs text-[#0a0a0a] font-[family-name:var(--font-montserrat)] uppercase tracking-wider">
                        {product.category}
                      </span>
                    </div>

                    {/* Sale Badge */}
                    {product.salePrice && (
                      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-red-500 px-2 py-0.5 sm:px-3 sm:py-1">
                        <span className="text-[8px] sm:text-xs text-white font-[family-name:var(--font-montserrat)] uppercase tracking-wider">
                          Sale
                        </span>
                      </div>
                    )}

                    {/* Out of Stock Overlay */}
                    {!isInStock(product) && (
                      <div className="absolute inset-0 bg-[#0a0a0a]/70 flex items-center justify-center">
                        <span className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] uppercase tracking-wider">
                          Sold Out
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                      {product.salePrice ? (
                        <div className="flex items-center gap-2">
                          <p className="text-[#c9a962] text-sm sm:text-lg font-[family-name:var(--font-montserrat)] font-medium">
                            {formatPrice(product.salePrice)}
                          </p>
                          <p className="text-[#888888] text-xs sm:text-sm font-[family-name:var(--font-montserrat)] line-through">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-[#c9a962] text-sm sm:text-lg font-[family-name:var(--font-montserrat)] font-medium">
                          {formatPrice(product.price)}
                        </p>
                      )}
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5] group-hover:text-[#c9a962] transition-colors">
                    {product.name}
                  </h3>
                  {product.colors && product.colors.length > 0 && (
                    <p className="text-[#888888] text-[10px] sm:text-xs font-[family-name:var(--font-montserrat)] mt-0.5 sm:mt-1">
                      {product.colors.join(", ")}
                    </p>
                  )}
                </Link>
              ))}
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
              {/* Image Gallery */}
              <div className="relative">
                {/* Main Image */}
                <div className="aspect-[3/4] relative">
                  <Image
                    src={selectedProduct.images[selectedImageIndex] || "/images/placeholder.jpg"}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover object-top"
                  />
                  {selectedProduct.salePrice && (
                    <div className="absolute top-4 left-4 bg-red-500 px-3 py-1">
                      <span className="text-xs text-white font-[family-name:var(--font-montserrat)] uppercase tracking-wider">
                        Sale
                      </span>
                    </div>
                  )}

                  {/* Navigation Arrows - only show if multiple images */}
                  {selectedProduct.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImageIndex((prev) =>
                            prev === 0 ? selectedProduct.images.length - 1 : prev - 1
                          );
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0a0a0a]/70 hover:bg-[#0a0a0a]/90 text-white flex items-center justify-center transition-colors"
                        aria-label="Previous image"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImageIndex((prev) =>
                            prev === selectedProduct.images.length - 1 ? 0 : prev + 1
                          );
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0a0a0a]/70 hover:bg-[#0a0a0a]/90 text-white flex items-center justify-center transition-colors"
                        aria-label="Next image"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {selectedProduct.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#0a0a0a]/70 px-3 py-1 text-xs text-white font-[family-name:var(--font-montserrat)]">
                      {selectedImageIndex + 1} / {selectedProduct.images.length}
                    </div>
                  )}
                </div>

                {/* Thumbnail Strip - only show if multiple images */}
                {selectedProduct.images.length > 1 && (
                  <div className="flex gap-2 p-3 bg-[#0a0a0a] overflow-x-auto">
                    {selectedProduct.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImageIndex(idx);
                        }}
                        className={`flex-shrink-0 w-16 h-20 relative border-2 transition-colors ${
                          selectedImageIndex === idx
                            ? "border-[#c9a962]"
                            : "border-transparent hover:border-[#888888]"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${selectedProduct.name} - Image ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
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

                {selectedProduct.salePrice ? (
                  <div className="flex items-center gap-3 mb-4">
                    <p className="text-2xl text-[#c9a962] font-[family-name:var(--font-montserrat)]">
                      {formatPrice(selectedProduct.salePrice)}
                    </p>
                    <p className="text-lg text-[#888888] font-[family-name:var(--font-montserrat)] line-through">
                      {formatPrice(selectedProduct.price)}
                    </p>
                  </div>
                ) : (
                  <p className="text-2xl text-[#c9a962] font-[family-name:var(--font-montserrat)] mb-4">
                    {formatPrice(selectedProduct.price)}
                  </p>
                )}

                <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)] mb-6 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] mb-2">
                      Color: <span className="text-[#888888]">{selectedProduct.colors.join(", ")}</span>
                    </p>
                  </div>
                )}

                {/* Size Selection */}
                <div className="mb-6">
                  <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] mb-2">
                    Select Size:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedProduct.sizes).map(([size, stock]) => (
                      <button
                        key={size}
                        onClick={() => stock > 0 && setSelectedSize(size)}
                        disabled={stock === 0}
                        className={`px-4 py-2 border text-sm font-[family-name:var(--font-montserrat)] transition-colors ${
                          selectedSize === size
                            ? "border-[#c9a962] bg-[#c9a962] text-[#0a0a0a]"
                            : stock > 0
                            ? "border-[#2a2a2a] text-[#888888] hover:border-[#c9a962] hover:text-[#c9a962]"
                            : "border-[#2a2a2a] text-[#444444] cursor-not-allowed line-through"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {!selectedSize && isInStock(selectedProduct) && (
                    <p className="text-[#c9a962] text-xs mt-2 font-[family-name:var(--font-montserrat)]">
                      Please select a size
                    </p>
                  )}
                </div>

                <div className="mt-auto space-y-3">
                  {isInStock(selectedProduct) ? (
                    <button
                      onClick={handleAddToCart}
                      disabled={!selectedSize}
                      className="w-full bg-[#c9a962] text-[#0a0a0a] py-3 text-sm tracking-[0.1em] uppercase font-[family-name:var(--font-montserrat)] hover:bg-[#e5d4a1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Add to Bag
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-[#2a2a2a] text-[#888888] py-3 text-sm tracking-[0.1em] uppercase font-[family-name:var(--font-montserrat)] cursor-not-allowed"
                    >
                      Sold Out
                    </button>
                  )}
                  <p className="text-[#888888] text-xs text-center font-[family-name:var(--font-montserrat)]">
                    Free delivery on orders above ₦100,000
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
                Pay securely online or choose pay on delivery.
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
