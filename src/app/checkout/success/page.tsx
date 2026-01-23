"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Order } from "@/lib/firebase-types";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
};

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const isPaid = searchParams.get("paid") === "true";
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const orderDoc = await getDoc(doc(db, "orders", orderId));
        if (orderDoc.exists()) {
          setOrder({ id: orderDoc.id, ...orderDoc.data() } as Order);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#c9a962] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#888888]">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderId || !order) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-24 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-2xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-4">
            Order Not Found
          </h1>
          <p className="text-[#888888] font-[family-name:var(--font-montserrat)] mb-6">
            We couldn&apos;t find the order you&apos;re looking for.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#c9a962] text-[#0a0a0a] px-6 py-3 text-sm tracking-[0.1em] uppercase font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-2">
            {isPaid ? "Payment Successful!" : "Order Confirmed!"}
          </h1>
          <p className="text-[#888888] font-[family-name:var(--font-montserrat)]">
            {isPaid
              ? "Thank you for your payment. Your order is being processed."
              : "Thank you for your order. We'll contact you shortly to confirm."}
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#111111] border border-[#1a1a1a] p-6 mb-6">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#1a1a1a]">
            <div>
              <p className="text-xs text-[#888888] uppercase tracking-wider font-[family-name:var(--font-montserrat)]">
                Order Number
              </p>
              <p className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)] mt-1">
                #{orderId?.slice(-8).toUpperCase()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#888888] uppercase tracking-wider font-[family-name:var(--font-montserrat)]">
                Status
              </p>
              <span className="inline-block mt-1 px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-[family-name:var(--font-montserrat)] uppercase">
                {order.status}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="text-sm text-[#888888] uppercase tracking-wider font-[family-name:var(--font-montserrat)] mb-4">
              Items Ordered ({order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0})
            </h3>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b border-[#1a1a1a] last:border-b-0 last:pb-0">
                  {/* Product Image - Larger and clickable */}
                  {item.image ? (
                    <button
                      onClick={() => setViewingImage(item.image || null)}
                      className="w-20 h-20 flex-shrink-0 bg-[#0a0a0a] border border-[#1a1a1a] overflow-hidden hover:border-[#c9a962] transition-colors group relative"
                    >
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </button>
                  ) : (
                    <div className="w-20 h-20 flex-shrink-0 bg-[#0a0a0a] border border-[#1a1a1a] flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#2a2a2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)] text-sm">
                        {item.productName}
                      </p>
                      {item.sku && (
                        <span className="text-[10px] text-[#c9a962] bg-[#c9a962]/10 px-2 py-0.5 font-[family-name:var(--font-montserrat)] whitespace-nowrap">
                          {item.sku}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-sm text-[#888888] font-[family-name:var(--font-montserrat)]">
                      {item.size && (
                        <span>Size: <span className="text-[#f5f5f5]">{item.size}</span></span>
                      )}
                      <span>Qty: <span className="text-[#f5f5f5]">{item.quantity}</span></span>
                    </div>
                    <p className="text-[#c9a962] text-sm mt-2 font-[family-name:var(--font-montserrat)] font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="mb-6 pb-6 border-b border-[#1a1a1a]">
            <h3 className="text-sm text-[#888888] uppercase tracking-wider font-[family-name:var(--font-montserrat)] mb-4">
              Delivery
            </h3>
            <p className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
              {order.deliveryMethod === "pickup" ? (
                "Studio Pickup"
              ) : (
                <>
                  {order.deliveryAddress?.street}<br />
                  {order.deliveryAddress?.city}, {order.deliveryAddress?.state}
                  {order.deliveryAddress?.landmark && (
                    <><br />Near: {order.deliveryAddress.landmark}</>
                  )}
                </>
              )}
            </p>
          </div>

          {/* Payment & Total */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-[family-name:var(--font-montserrat)]">
              <span className="text-[#888888]">Subtotal</span>
              <span className="text-[#f5f5f5]">{formatPrice(order.pricing.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm font-[family-name:var(--font-montserrat)]">
              <span className="text-[#888888]">Delivery</span>
              <span className="text-[#f5f5f5]">
                {order.pricing.deliveryFee === 0 ? "Free" : formatPrice(order.pricing.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-[family-name:var(--font-cormorant)] pt-4 border-t border-[#1a1a1a]">
              <span className="text-[#f5f5f5]">Total</span>
              <span className="text-[#c9a962]">{formatPrice(order.pricing.totalAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-[family-name:var(--font-montserrat)] pt-2">
              <span className="text-[#888888]">
                Payment: {order.paymentMethod === "online" ? "Online Payment" : "Pay on Delivery"}
              </span>
              {(isPaid || (order as Order & { paymentStatus?: string }).paymentStatus === "paid") && (
                <span className="px-2 py-1 bg-green-500/20 text-green-400 uppercase text-[10px]">
                  Paid
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-[#111111] border border-[#1a1a1a] p-6 mb-6">
          <h3 className="text-sm text-[#888888] uppercase tracking-wider font-[family-name:var(--font-montserrat)] mb-4">
            Contact Information
          </h3>
          <p className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
            {order.userName}<br />
            {order.userPhone}
          </p>
        </div>

        {/* What's Next */}
        <div className="bg-[#c9a962]/10 border border-[#c9a962]/30 p-6 mb-8">
          <h3 className="text-[#c9a962] font-[family-name:var(--font-cormorant)] text-lg mb-3">
            What&apos;s Next?
          </h3>
          <ul className="space-y-2 text-sm text-[#888888] font-[family-name:var(--font-montserrat)]">
            <li className="flex items-start gap-2">
              <span className="text-[#c9a962]">1.</span>
              We&apos;ll confirm your order via WhatsApp or phone call
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#c9a962]">2.</span>
              {isPaid || (order as Order & { paymentStatus?: string }).paymentStatus === "paid"
                ? "Your payment has been confirmed"
                : order.paymentMethod === "online"
                ? "Complete your payment to confirm the order"
                : "Prepare your payment for delivery"}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#c9a962]">3.</span>
              {order.deliveryMethod === "pickup"
                ? "We'll let you know when your order is ready for pickup"
                : "Your order will be dispatched within 2-3 business days"}
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/shop"
            className="flex-1 text-center bg-[#c9a962] text-[#0a0a0a] py-3 text-sm tracking-[0.1em] uppercase font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/account/orders"
            className="flex-1 text-center border border-[#2a2a2a] text-[#888888] py-3 text-sm font-[family-name:var(--font-montserrat)] hover:border-[#c9a962] hover:text-[#c9a962] transition-colors"
          >
            View My Orders
          </Link>
        </div>
      </div>

      {/* Image Lightbox */}
      {viewingImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
          onClick={() => setViewingImage(null)}
        >
          <button
            onClick={() => setViewingImage(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={viewingImage}
            alt="Product"
            className="max-w-full max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#c9a962] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#888888]">Loading...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
