"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/lib/firebase-types";
import { useCart } from "@/contexts/CartContext";
import SizeGuide from "@/components/SizeGuide";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const productDoc = await getDoc(doc(db, "products", productId));
        if (productDoc.exists()) {
          const productData = { id: productDoc.id, ...productDoc.data() } as Product;
          // Only show active products
          if (productData.active) {
            setProduct(productData);
          } else {
            router.push("/shop");
          }
        } else {
          router.push("/shop");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        router.push("/shop");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    addToCart(product, selectedSize);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const getAvailableSizes = (product: Product) => {
    return Object.entries(product.sizes)
      .filter(([, stock]) => stock > 0)
      .map(([size]) => size);
  };

  const isInStock = (product: Product) => {
    return Object.values(product.sizes).some((stock) => stock > 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#c9a962] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#888888] font-[family-name:var(--font-montserrat)] mb-4">
            Product not found
          </p>
          <Link
            href="/shop"
            className="text-[#c9a962] hover:underline font-[family-name:var(--font-montserrat)]"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <section className="pt-24 sm:pt-28 px-4 sm:px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm font-[family-name:var(--font-montserrat)]">
            <ol className="flex items-center gap-2 text-[#888888]">
              <li>
                <Link href="/" className="hover:text-[#c9a962] transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/shop" className="hover:text-[#c9a962] transition-colors">
                  Shop
                </Link>
              </li>
              <li>/</li>
              <li className="text-[#f5f5f5]">{product.name}</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Product Detail */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div>
              {/* Main Image */}
              <div className="aspect-[3/4] relative mb-4 bg-[#111111]">
                <Image
                  src={product.images[selectedImageIndex] || "/images/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover object-top"
                  priority
                />
                {product.salePrice && (
                  <div className="absolute top-4 left-4 bg-red-500 px-3 py-1">
                    <span className="text-xs text-white font-[family-name:var(--font-montserrat)] uppercase tracking-wider">
                      Sale
                    </span>
                  </div>
                )}

                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((prev) =>
                          prev === 0 ? product.images.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#0a0a0a]/70 hover:bg-[#0a0a0a]/90 text-white flex items-center justify-center transition-colors"
                      aria-label="Previous image"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((prev) =>
                          prev === product.images.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#0a0a0a]/70 hover:bg-[#0a0a0a]/90 text-white flex items-center justify-center transition-colors"
                      aria-label="Next image"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Out of Stock Overlay */}
                {!isInStock(product) && (
                  <div className="absolute inset-0 bg-[#0a0a0a]/70 flex items-center justify-center">
                    <span className="text-[#f5f5f5] text-xl font-[family-name:var(--font-montserrat)] uppercase tracking-wider">
                      Sold Out
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-24 relative border-2 transition-colors ${
                        selectedImageIndex === idx
                          ? "border-[#c9a962]"
                          : "border-transparent hover:border-[#888888]"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} - Image ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="lg:py-8">
              <p className="text-[#c9a962] text-xs tracking-[0.2em] uppercase font-[family-name:var(--font-montserrat)] mb-3">
                {product.category}
              </p>
              <h1 className="text-3xl sm:text-4xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-4">
                {product.name}
              </h1>

              {/* Price */}
              {product.salePrice ? (
                <div className="flex items-center gap-4 mb-6">
                  <p className="text-2xl sm:text-3xl text-[#c9a962] font-[family-name:var(--font-montserrat)]">
                    {formatPrice(product.salePrice)}
                  </p>
                  <p className="text-lg text-[#888888] font-[family-name:var(--font-montserrat)] line-through">
                    {formatPrice(product.price)}
                  </p>
                  <span className="bg-red-500 text-white text-xs px-2 py-1 font-[family-name:var(--font-montserrat)]">
                    {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                  </span>
                </div>
              ) : (
                <p className="text-2xl sm:text-3xl text-[#c9a962] font-[family-name:var(--font-montserrat)] mb-6">
                  {formatPrice(product.price)}
                </p>
              )}

              {/* Description */}
              <p className="text-[#888888] font-[family-name:var(--font-montserrat)] leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] mb-2">
                    Color
                  </p>
                  <p className="text-[#888888] font-[family-name:var(--font-montserrat)]">
                    {product.colors.join(", ")}
                  </p>
                </div>
              )}

              {/* Size Selection */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)]">
                    Select Size
                  </p>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-[#c9a962] text-xs font-[family-name:var(--font-montserrat)] hover:underline"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(product.sizes).map(([size, stock]) => (
                    <button
                      key={size}
                      onClick={() => stock > 0 && setSelectedSize(size)}
                      disabled={stock === 0}
                      className={`min-w-[60px] px-4 py-3 border text-sm font-[family-name:var(--font-montserrat)] transition-colors ${
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
                {!selectedSize && isInStock(product) && (
                  <p className="text-[#c9a962] text-xs mt-3 font-[family-name:var(--font-montserrat)]">
                    Please select a size to add to bag
                  </p>
                )}
              </div>

              {/* Add to Cart Button */}
              <div className="space-y-4">
                {isInStock(product) ? (
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedSize}
                    className={`w-full py-4 text-sm tracking-[0.1em] uppercase font-[family-name:var(--font-montserrat)] transition-colors flex items-center justify-center gap-3 ${
                      addedToCart
                        ? "bg-green-500 text-white"
                        : "bg-[#c9a962] text-[#0a0a0a] hover:bg-[#e5d4a1] disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Added to Bag
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Add to Bag
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-[#2a2a2a] text-[#888888] py-4 text-sm tracking-[0.1em] uppercase font-[family-name:var(--font-montserrat)] cursor-not-allowed"
                  >
                    Sold Out
                  </button>
                )}

                <p className="text-[#888888] text-xs text-center font-[family-name:var(--font-montserrat)]">
                  Free delivery on orders above ₦100,000
                </p>
              </div>

              {/* Product Features */}
              <div className="mt-10 pt-8 border-t border-[#1a1a1a]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <span className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                      Fast Delivery
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                      Quality Guaranteed
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                      Secure Payment
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                      Support Available
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#0f0f0f]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-light text-[#f5f5f5] font-[family-name:var(--font-cormorant)] mb-4">
            Need a Custom Fit?
          </h2>
          <p className="text-[#888888] font-[family-name:var(--font-montserrat)] mb-8">
            We can create this design with your exact measurements for a perfect fit.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-transparent border border-[#c9a962] text-[#c9a962] px-8 py-3 text-sm tracking-[0.1em] uppercase font-[family-name:var(--font-montserrat)] hover:bg-[#c9a962] hover:text-[#0a0a0a] transition-colors"
          >
            Book a Consultation
          </Link>
        </div>
      </section>

      {/* Size Guide Modal */}
      <SizeGuide isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </>
  );
}
