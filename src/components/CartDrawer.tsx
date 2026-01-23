"use client";

import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import Link from "next/link";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
};

export default function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    removeFromCart,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 z-50"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a] z-50 flex flex-col border-l border-[#1a1a1a]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1a1a1a]">
          <h2 className="text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
            Shopping Bag ({itemCount})
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-[#888888] hover:text-[#f5f5f5] transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="text-[#888888] font-[family-name:var(--font-montserrat)] mb-4">
                Your bag is empty
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-[#c9a962] text-sm font-[family-name:var(--font-montserrat)] hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex gap-4 bg-[#111111] p-3 border border-[#1a1a1a]"
                >
                  <div className="w-20 h-24 relative flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-[family-name:var(--font-cormorant)] text-[#f5f5f5] truncate">
                      {item.productName}
                    </h3>
                    <p className="text-xs text-[#888888] font-[family-name:var(--font-montserrat)] mt-1">
                      Size: {item.size}
                    </p>
                    <p className="text-sm text-[#c9a962] font-[family-name:var(--font-montserrat)] mt-1">
                      {formatPrice(item.salePrice || item.price)}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#2a2a2a]">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.quantity - 1
                            )
                          }
                          className="px-2 py-1 text-[#888888] hover:text-[#f5f5f5] transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-sm text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.quantity + 1
                            )
                          }
                          disabled={item.quantity >= item.maxStock}
                          className={`px-2 py-1 transition-colors ${
                            item.quantity >= item.maxStock
                              ? "text-[#444444] cursor-not-allowed"
                              : "text-[#888888] hover:text-[#f5f5f5]"
                          }`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId, item.size)}
                        className="text-red-400 text-xs font-[family-name:var(--font-montserrat)] hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                    {item.quantity >= item.maxStock && (
                      <p className="text-[10px] text-[#c9a962] font-[family-name:var(--font-montserrat)] mt-1">
                        Max available: {item.maxStock}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-[#1a1a1a] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[#888888] font-[family-name:var(--font-montserrat)]">
                Subtotal
              </span>
              <span className="text-xl text-[#f5f5f5] font-[family-name:var(--font-cormorant)]">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-xs text-[#888888] font-[family-name:var(--font-montserrat)]">
              Delivery calculated at checkout
            </p>
            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="block w-full bg-[#c9a962] text-[#0a0a0a] py-3 text-center text-sm tracking-[0.1em] uppercase font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={() => setIsCartOpen(false)}
              className="block w-full text-center text-[#888888] text-sm font-[family-name:var(--font-montserrat)] hover:text-[#c9a962] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
