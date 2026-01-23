"use client";

import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Order, OrderStatus, OrderType } from "@/lib/firebase-types";
import Link from "next/link";

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  "in-progress": "bg-purple-500/20 text-purple-400 border-purple-500/50",
  ready: "bg-green-500/20 text-green-400 border-green-500/50",
  delivered: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/50",
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending Confirmation",
  confirmed: "Confirmed",
  "in-progress": "In Progress",
  ready: "Ready for Pickup/Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const typeLabels: Record<OrderType, string> = {
  "ready-to-wear": "Ready to Wear",
  "full-bespoke": "Full Bespoke",
  "sew-only": "Sew Only",
  "bulk-bespoke": "Bulk Order",
};

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (!user?.phone) return;

    const ordersQuery = query(
      collection(db, "orders"),
      where("userPhone", "==", user.phone),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Order;
      });
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.phone]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const activeOrders = orders.filter(
    (o) => !["delivered", "cancelled"].includes(o.status)
  );
  const completedOrders = orders.filter((o) =>
    ["delivered", "cancelled"].includes(o.status)
  );

  const canCancelOrder = (order: Order) => {
    // Only allow cancellation for pending orders
    return order.status === "pending";
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;

    setCancelling(true);
    try {
      await updateDoc(doc(db, "orders", selectedOrder.id), {
        status: "cancelled",
        updatedAt: Timestamp.now(),
      });
      setSelectedOrder({ ...selectedOrder, status: "cancelled" });
      setShowCancelConfirm(false);
    } catch (error) {
      console.error("Error cancelling order:", error);
    } finally {
      setCancelling(false);
    }
  };

  // Check if order has unpaid amounts
  const getUnpaidAmount = (order: Order) => {
    const pricing = order.pricing;

    // If order uses deposit/balance structure
    if (pricing.depositAmount !== undefined) {
      if (!pricing.depositPaid) {
        return { type: "deposit" as const, amount: pricing.depositAmount };
      }
      if (!pricing.balancePaid && pricing.balanceAmount && pricing.balanceAmount > 0) {
        return { type: "balance" as const, amount: pricing.balanceAmount };
      }
    } else {
      // Full payment - check if not marked as paid
      // For orders without deposit structure, we need to check paymentMethod
      if (order.paymentMethod === "online" && !pricing.depositPaid) {
        return { type: "full" as const, amount: pricing.totalAmount };
      }
    }

    return null;
  };

  const handlePayNow = async () => {
    if (!selectedOrder || !user) return;

    const unpaid = getUnpaidAmount(selectedOrder);
    if (!unpaid) return;

    setProcessingPayment(true);
    try {
      // Initialize Paystack payment
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email || `${user.phone}@customer.nifemiiabe.com`,
          amount: unpaid.amount,
          orderId: selectedOrder.id,
          paymentType: unpaid.type,
          callbackUrl: `${window.location.origin}/account/orders/verify`,
          metadata: {
            customerName: user.name || selectedOrder.userName,
            customerPhone: user.phone,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize payment");
      }

      // Redirect to Paystack payment page
      window.location.href = data.authorization_url;
    } catch (error) {
      console.error("Payment initialization error:", error);
      alert("Failed to initialize payment. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
          My Orders
          </h1>
          <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
            Track your orders and view order history
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-[#888888]">Loading orders...</div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#111111] border border-[#1a1a1a] p-12 text-center">
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
              You haven&apos;t placed any orders yet
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#c9a962] text-[#0a0a0a] px-6 py-2 font-[family-name:var(--font-montserrat)] text-sm uppercase tracking-wider hover:bg-[#d4b87a] transition-colors"
            >
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active Orders */}
            {activeOrders.length > 0 && (
              <div>
                <h2 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-4">
                  Active Orders ({activeOrders.length})
                </h2>
                <div className="space-y-4">
                  {activeOrders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="bg-[#111111] border border-[#1a1a1a] p-4 hover:border-[#c9a962]/50 transition-colors cursor-pointer"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                              Order #{order.id.slice(0, 8)}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-xs border ${statusColors[order.status]} font-[family-name:var(--font-montserrat)]`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-[#888888] font-[family-name:var(--font-montserrat)]">
                            {typeLabels[order.type]} • Placed {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#c9a962] font-[family-name:var(--font-montserrat)]">
                            {formatCurrency(order.pricing.totalAmount)}
                          </p>
                          <p className="text-xs text-[#888888] font-[family-name:var(--font-montserrat)]">
                            {order.deliveryMethod === "pickup" ? "Pickup" : "Delivery"}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex items-center gap-2">
                          {["pending", "confirmed", "in-progress", "ready", "delivered"].map(
                            (step, idx) => {
                              const stepIndex = [
                                "pending",
                                "confirmed",
                                "in-progress",
                                "ready",
                                "delivered",
                              ].indexOf(order.status);
                              const isCompleted = idx <= stepIndex;
                              const isCurrent = step === order.status;

                              return (
                                <div key={step} className="flex-1">
                                  <div
                                    className={`h-1 ${
                                      isCompleted ? "bg-[#c9a962]" : "bg-[#2a2a2a]"
                                    }`}
                                  />
                                  {isCurrent && (
                                    <p className="text-[10px] text-[#c9a962] mt-1 font-[family-name:var(--font-montserrat)] capitalize">
                                      {step.replace("-", " ")}
                                    </p>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Orders */}
            {completedOrders.length > 0 && (
              <div>
                <h2 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-4">
                  Order History ({completedOrders.length})
                </h2>
                <div className="bg-[#111111] border border-[#1a1a1a] divide-y divide-[#1a1a1a]">
                  {completedOrders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="p-4 hover:bg-[#1a1a1a]/50 transition-colors cursor-pointer"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                            #{order.id.slice(0, 8)}
                          </span>
                          <span className="text-[#888888] text-sm ml-3 font-[family-name:var(--font-montserrat)]">
                            {typeLabels[order.type]}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={`px-2 py-0.5 text-xs border ${statusColors[order.status]} font-[family-name:var(--font-montserrat)]`}
                          >
                            {order.status}
                          </span>
                          <span className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                            {formatDate(order.createdAt)}
                          </span>
                          <span className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                            {formatCurrency(order.pricing.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-[#111111] border border-[#1a1a1a] w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-[#111111] border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
                  Order #{selectedOrder.id.slice(0, 8)}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-[#888888] hover:text-[#f5f5f5]"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status */}
                <div className="text-center">
                  <span
                    className={`inline-block px-4 py-2 text-sm border ${statusColors[selectedOrder.status]} font-[family-name:var(--font-montserrat)]`}
                  >
                    {statusLabels[selectedOrder.status]}
                  </span>
                </div>

                {/* Order Type */}
                <div className="bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
                  <p className="text-xs text-[#666666] mb-1 font-[family-name:var(--font-montserrat)]">
                    Order Type
                  </p>
                  <p className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                    {typeLabels[selectedOrder.type]}
                  </p>
                </div>

                {/* Items */}
                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <div className="bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
                    <p className="text-xs text-[#666666] mb-3 font-[family-name:var(--font-montserrat)]">
                      Items ({selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)} total)
                    </p>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex gap-4 pb-4 border-b border-[#1a1a1a] last:border-b-0 last:pb-0"
                        >
                          {/* Product Image - Larger and clickable */}
                          {item.image ? (
                            <button
                              onClick={() => setViewingImage(item.image || null)}
                              className="w-20 h-20 flex-shrink-0 bg-[#111111] border border-[#1a1a1a] overflow-hidden hover:border-[#c9a962] transition-colors group relative"
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
                            <div className="w-20 h-20 flex-shrink-0 bg-[#111111] border border-[#1a1a1a] flex items-center justify-center">
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
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Service Details */}
                {selectedOrder.serviceDetails && (
                  <div className="bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
                    <p className="text-xs text-[#666666] mb-2 font-[family-name:var(--font-montserrat)]">
                      Service Details
                    </p>
                    {selectedOrder.serviceDetails.styleDescription && (
                      <p className="text-[#f5f5f5] text-sm mb-2 font-[family-name:var(--font-montserrat)]">
                        {selectedOrder.serviceDetails.styleDescription}
                      </p>
                    )}
                    <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                      Fabric:{" "}
                      {selectedOrder.serviceDetails.fabricProvided
                        ? "Provided by you"
                        : "Studio fabric"}
                    </p>
                  </div>
                )}

                {/* Pricing */}
                <div className="bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
                  <p className="text-xs text-[#666666] mb-3 font-[family-name:var(--font-montserrat)]">
                    Payment Summary
                  </p>
                  <div className="space-y-2 text-sm font-[family-name:var(--font-montserrat)]">
                    <div className="flex justify-between">
                      <span className="text-[#888888]">Subtotal</span>
                      <span className="text-[#f5f5f5]">
                        {formatCurrency(selectedOrder.pricing.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#888888]">Delivery</span>
                      <span className="text-[#f5f5f5]">
                        {selectedOrder.pricing.deliveryFee > 0
                          ? formatCurrency(selectedOrder.pricing.deliveryFee)
                          : "Free"}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#1a1a1a]">
                      <span className="text-[#f5f5f5] font-medium">Total</span>
                      <span className="text-[#c9a962]">
                        {formatCurrency(selectedOrder.pricing.totalAmount)}
                      </span>
                    </div>
                    {selectedOrder.pricing.depositAmount && (
                      <>
                        <div className="flex justify-between text-xs pt-2">
                          <span className="text-[#888888]">Deposit</span>
                          <span
                            className={
                              selectedOrder.pricing.depositPaid
                                ? "text-green-400"
                                : "text-yellow-400"
                            }
                          >
                            {formatCurrency(selectedOrder.pricing.depositAmount)}{" "}
                            {selectedOrder.pricing.depositPaid ? "(Paid)" : "(Pending)"}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-[#888888]">Balance</span>
                          <span
                            className={
                              selectedOrder.pricing.balancePaid
                                ? "text-green-400"
                                : "text-yellow-400"
                            }
                          >
                            {formatCurrency(selectedOrder.pricing.balanceAmount || 0)}{" "}
                            {selectedOrder.pricing.balancePaid ? "(Paid)" : "(Pending)"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Pay Now Button */}
                  {selectedOrder.status !== "cancelled" &&
                    selectedOrder.status !== "delivered" &&
                    getUnpaidAmount(selectedOrder) && (
                      <button
                        onClick={handlePayNow}
                        disabled={processingPayment}
                        className="w-full mt-4 bg-[#c9a962] text-[#0a0a0a] py-3 text-sm tracking-[0.1em] uppercase font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors disabled:opacity-50"
                      >
                        {processingPayment ? (
                          "Processing..."
                        ) : (
                          <>
                            Pay {getUnpaidAmount(selectedOrder)?.type === "deposit" ? "Deposit" : getUnpaidAmount(selectedOrder)?.type === "balance" ? "Balance" : ""} Now - {formatCurrency(getUnpaidAmount(selectedOrder)?.amount || 0)}
                          </>
                        )}
                      </button>
                    )}
                </div>

                {/* Delivery */}
                <div className="bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
                  <p className="text-xs text-[#666666] mb-2 font-[family-name:var(--font-montserrat)]">
                    {selectedOrder.deliveryMethod === "pickup"
                      ? "Pickup Location"
                      : "Delivery Address"}
                  </p>
                  {selectedOrder.deliveryMethod === "pickup" ? (
                    <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)]">
                      Nifemii Abe Studio
                    </p>
                  ) : (
                    selectedOrder.deliveryAddress && (
                      <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)]">
                        {selectedOrder.deliveryAddress.street},{" "}
                        {selectedOrder.deliveryAddress.city},{" "}
                        {selectedOrder.deliveryAddress.state}
                      </p>
                    )
                  )}
                </div>

                {/* Order Date */}
                <div className="text-center text-sm text-[#888888] font-[family-name:var(--font-montserrat)]">
                  Order placed on {formatDate(selectedOrder.createdAt)}
                </div>

                {/* Cancel Order Button */}
                {canCancelOrder(selectedOrder) && !showCancelConfirm && (
                  <div className="pt-4 border-t border-[#1a1a1a]">
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      className="w-full border border-red-500/50 text-red-400 py-2 text-sm font-[family-name:var(--font-montserrat)] hover:bg-red-500/10 transition-colors"
                    >
                      Cancel Order
                    </button>
                    <p className="text-xs text-[#666666] text-center mt-2 font-[family-name:var(--font-montserrat)]">
                      You can only cancel orders that haven&apos;t been confirmed yet
                    </p>
                  </div>
                )}

                {/* Cancel Confirmation */}
                {showCancelConfirm && (
                  <div className="pt-4 border-t border-[#1a1a1a] bg-red-500/10 -mx-6 -mb-6 p-6">
                    <p className="text-red-400 text-sm font-[family-name:var(--font-montserrat)] mb-4 text-center">
                      Are you sure you want to cancel this order? This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowCancelConfirm(false)}
                        disabled={cancelling}
                        className="flex-1 border border-[#2a2a2a] text-[#f5f5f5] py-2 text-sm font-[family-name:var(--font-montserrat)] hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
                      >
                        Keep Order
                      </button>
                      <button
                        onClick={handleCancelOrder}
                        disabled={cancelling}
                        className="flex-1 bg-red-500 text-white py-2 text-sm font-[family-name:var(--font-montserrat)] hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        {cancelling ? "Cancelling..." : "Yes, Cancel"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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
