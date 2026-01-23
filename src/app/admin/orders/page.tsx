"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Order, OrderStatus, OrderType } from "@/lib/firebase-types";

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  "in-progress": "bg-purple-500/20 text-purple-400 border-purple-500/50",
  ready: "bg-green-500/20 text-green-400 border-green-500/50",
  delivered: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/50",
};

const typeLabels: Record<OrderType, string> = {
  "ready-to-wear": "Ready to Wear",
  "full-bespoke": "Full Bespoke",
  "sew-only": "Sew Only",
  "bulk-bespoke": "Bulk Order",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [filterType, setFilterType] = useState<OrderType | "all">("all");
  const [adminNotes, setAdminNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<"deposit" | "balance" | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "transfer">("cash");
  const [recordingPayment, setRecordingPayment] = useState(false);

  useEffect(() => {
    const ordersQuery = query(
      collection(db, "orders"),
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
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (filterStatus !== "all" && order.status !== filterStatus) return false;
    if (filterType !== "all" && order.type !== filterType) return false;
    return true;
  });

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,
        updatedAt: Timestamp.now(),
      });
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleOpenOrder = (order: Order) => {
    setSelectedOrder(order);
    setAdminNotes(order.adminNotes || "");
    setShowPaymentModal(null);
  };

  const recordPayment = async (type: "deposit" | "balance") => {
    if (!selectedOrder) return;

    setRecordingPayment(true);
    try {
      const updateData: Record<string, unknown> = {
        updatedAt: Timestamp.now(),
      };

      if (type === "deposit") {
        updateData["pricing.depositPaid"] = true;
        updateData["pricing.depositMethod"] = paymentMethod;
        updateData["pricing.depositDate"] = Timestamp.now();
        // Confirm order when deposit is paid
        if (selectedOrder.status === "pending") {
          updateData.status = "confirmed";
        }
      } else {
        updateData["pricing.balancePaid"] = true;
        updateData["pricing.balanceMethod"] = paymentMethod;
        updateData["pricing.balanceDate"] = Timestamp.now();
      }

      await updateDoc(doc(db, "orders", selectedOrder.id), updateData);

      // Update local state
      const updatedPricing = {
        ...selectedOrder.pricing,
        ...(type === "deposit"
          ? { depositPaid: true, depositMethod: paymentMethod }
          : { balancePaid: true, balanceMethod: paymentMethod }),
      };
      setSelectedOrder({
        ...selectedOrder,
        pricing: updatedPricing,
        status: type === "deposit" && selectedOrder.status === "pending" ? "confirmed" : selectedOrder.status,
      });
      setShowPaymentModal(null);
    } catch (error) {
      console.error("Error recording payment:", error);
      alert("Failed to record payment. Please try again.");
    } finally {
      setRecordingPayment(false);
    }
  };

  const saveAdminNotes = async () => {
    if (!selectedOrder) return;

    setSavingNotes(true);
    try {
      await updateDoc(doc(db, "orders", selectedOrder.id), {
        adminNotes: adminNotes,
        updatedAt: Timestamp.now(),
      });
      setSelectedOrder({ ...selectedOrder, adminNotes });
    } catch (error) {
      console.error("Error saving admin notes:", error);
    } finally {
      setSavingNotes(false);
    }
  };

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

  const formatDueDate = (dueDateStr: string) => {
    const date = new Date(dueDateStr + "T00:00:00");
    return new Intl.DateTimeFormat("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const getDueDateStatus = (dueDateStr: string, orderStatus: OrderStatus) => {
    if (orderStatus === "delivered" || orderStatus === "cancelled") {
      return "completed";
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dueDateStr + "T00:00:00");
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "overdue";
    if (diffDays <= 3) return "urgent";
    if (diffDays <= 7) return "soon";
    return "normal";
  };

  const dueDateColors = {
    overdue: "text-red-400",
    urgent: "text-orange-400",
    soon: "text-yellow-400",
    normal: "text-[#888888]",
    completed: "text-[#888888] line-through",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#888888]">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
          Orders
        </h1>
        <a
          href="/admin/orders/new"
          className="bg-[#c9a962] text-[#0a0a0a] px-4 py-2 text-sm font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors"
        >
          + Create Order
        </a>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as OrderStatus | "all")}
          className="bg-[#111111] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="in-progress">In Progress</option>
          <option value="ready">Ready</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as OrderType | "all")}
          className="bg-[#111111] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
        >
          <option value="all">All Types</option>
          <option value="ready-to-wear">Ready to Wear</option>
          <option value="full-bespoke">Full Bespoke</option>
          <option value="sew-only">Sew Only</option>
          <option value="bulk-bespoke">Bulk Order</option>
        </select>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-[#111111] border border-[#1a1a1a] p-12 text-center">
          <p className="text-[#888888] font-[family-name:var(--font-montserrat)]">
            No orders found
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-[#111111] border border-[#1a1a1a] p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                      #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-[#888888] font-[family-name:var(--font-montserrat)]">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs border ${statusColors[order.status]} font-[family-name:var(--font-montserrat)]`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#888888] font-[family-name:var(--font-montserrat)]">Customer</span>
                    <span className="text-sm text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">{order.userName || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#888888] font-[family-name:var(--font-montserrat)]">Type</span>
                    <span className="text-sm text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">{typeLabels[order.type]}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#888888] font-[family-name:var(--font-montserrat)]">Amount</span>
                    <span className="text-sm text-[#c9a962] font-[family-name:var(--font-montserrat)]">{formatCurrency(order.pricing.totalAmount)}</span>
                  </div>
                  {order.dueDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#888888] font-[family-name:var(--font-montserrat)]">Due</span>
                      <span className={`text-sm font-[family-name:var(--font-montserrat)] ${dueDateColors[getDueDateStatus(order.dueDate, order.status)]}`}>
                        {formatDueDate(order.dueDate)}
                        {getDueDateStatus(order.dueDate, order.status) === "overdue" && " (Overdue)"}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleOpenOrder(order)}
                  className="w-full bg-[#1a1a1a] text-[#c9a962] py-2 text-sm font-[family-name:var(--font-montserrat)] hover:bg-[#222222] transition-colors"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-[#111111] border border-[#1a1a1a] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0a0a0a] border-b border-[#1a1a1a]">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#888888] font-[family-name:var(--font-montserrat)]">
                      Order ID
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#888888] font-[family-name:var(--font-montserrat)]">
                      Customer
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#888888] font-[family-name:var(--font-montserrat)]">
                      Type
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#888888] font-[family-name:var(--font-montserrat)]">
                      Amount
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#888888] font-[family-name:var(--font-montserrat)]">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#888888] font-[family-name:var(--font-montserrat)]">
                      Date
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#888888] font-[family-name:var(--font-montserrat)]">
                      Due Date
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#888888] font-[family-name:var(--font-montserrat)]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-[#1a1a1a]/50 transition-colors"
                    >
                      <td className="px-4 py-4 text-sm text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                            {order.userName || "Unknown"}
                          </p>
                          <p className="text-xs text-[#888888] font-[family-name:var(--font-montserrat)]">
                            {order.userPhone}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-[#888888] font-[family-name:var(--font-montserrat)]">
                        {typeLabels[order.type]}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                        {formatCurrency(order.pricing.totalAmount)}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2 py-1 text-xs border ${statusColors[order.status]} font-[family-name:var(--font-montserrat)]`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-[#888888] font-[family-name:var(--font-montserrat)]">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-4 text-sm font-[family-name:var(--font-montserrat)]">
                        {order.dueDate ? (
                          <span className={dueDateColors[getDueDateStatus(order.dueDate, order.status)]}>
                            {formatDueDate(order.dueDate)}
                            {getDueDateStatus(order.dueDate, order.status) === "overdue" && (
                              <span className="ml-1 text-xs">(Overdue)</span>
                            )}
                          </span>
                        ) : (
                          <span className="text-[#555555]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleOpenOrder(order)}
                          className="text-[#c9a962] hover:text-[#d4b87a] text-sm font-[family-name:var(--font-montserrat)]"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && selectedOrder.id && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end md:items-center justify-center md:p-4">
          <div className="bg-[#111111] border border-[#1a1a1a] w-full md:max-w-2xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto rounded-t-xl md:rounded-none">
            <div className="sticky top-0 bg-[#111111] border-b border-[#1a1a1a] px-4 md:px-6 py-4 flex items-center justify-between">
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

            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              {/* Status Update */}
              <div>
                <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                  Status
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    updateOrderStatus(selectedOrder.id, e.target.value as OrderStatus)
                  }
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="ready">Ready</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Customer Info */}
              <div className="bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
                <h3 className="text-sm uppercase tracking-wider text-[#888888] mb-3 font-[family-name:var(--font-montserrat)]">
                  Customer
                </h3>
                <p className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                  {selectedOrder.userName || "Unknown"}
                </p>
                <p className="text-sm text-[#888888] font-[family-name:var(--font-montserrat)]">
                  {selectedOrder.userPhone}
                </p>
              </div>

              {/* Order Type & Due Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
                  <h3 className="text-sm uppercase tracking-wider text-[#888888] mb-3 font-[family-name:var(--font-montserrat)]">
                    Order Type
                  </h3>
                  <p className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                    {typeLabels[selectedOrder.type]}
                  </p>
                </div>

                <div className="bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
                  <h3 className="text-sm uppercase tracking-wider text-[#888888] mb-3 font-[family-name:var(--font-montserrat)]">
                    Due Date
                  </h3>
                  {selectedOrder.dueDate ? (
                    <p className={`font-[family-name:var(--font-montserrat)] ${dueDateColors[getDueDateStatus(selectedOrder.dueDate, selectedOrder.status)]}`}>
                      {formatDueDate(selectedOrder.dueDate)}
                      {getDueDateStatus(selectedOrder.dueDate, selectedOrder.status) === "overdue" && (
                        <span className="ml-2 text-xs bg-red-500/20 text-red-400 px-2 py-0.5 border border-red-500/50">
                          OVERDUE
                        </span>
                      )}
                      {getDueDateStatus(selectedOrder.dueDate, selectedOrder.status) === "urgent" && (
                        <span className="ml-2 text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 border border-orange-500/50">
                          DUE SOON
                        </span>
                      )}
                    </p>
                  ) : (
                    <p className="text-[#555555] font-[family-name:var(--font-montserrat)]">Not set</p>
                  )}
                </div>
              </div>

              {/* Items (for ready-to-wear) */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
                  <h3 className="text-sm uppercase tracking-wider text-[#888888] mb-4 font-[family-name:var(--font-montserrat)]">
                    Items ({selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)} total)
                  </h3>
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
                            className="w-24 h-24 flex-shrink-0 bg-[#111111] border border-[#1a1a1a] overflow-hidden hover:border-[#c9a962] transition-colors group relative"
                          >
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                              </svg>
                            </div>
                          </button>
                        ) : (
                          <div className="w-24 h-24 flex-shrink-0 bg-[#111111] border border-[#1a1a1a] flex items-center justify-center">
                            <svg className="w-10 h-10 text-[#2a2a2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-[#888888] font-[family-name:var(--font-montserrat)]">
                            {item.size && (
                              <span>Size: <span className="text-[#f5f5f5] font-medium">{item.size}</span></span>
                            )}
                            <span>Qty: <span className="text-[#f5f5f5] font-medium">{item.quantity}</span></span>
                            <span>@ {formatCurrency(item.price)}</span>
                          </div>
                          <p className="text-[#c9a962] text-base mt-2 font-[family-name:var(--font-montserrat)] font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Service Details (for bespoke/sew-only) */}
              {selectedOrder.serviceDetails && (
                <div className="bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
                  <h3 className="text-sm uppercase tracking-wider text-[#888888] mb-3 font-[family-name:var(--font-montserrat)]">
                    Service Details
                  </h3>
                  {selectedOrder.serviceDetails.styleDescription && (
                    <p className="text-[#f5f5f5] text-sm mb-2 font-[family-name:var(--font-montserrat)]">
                      {selectedOrder.serviceDetails.styleDescription}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm font-[family-name:var(--font-montserrat)]">
                    <span className="text-[#888888]">Fabric:</span>
                    <span className="text-[#f5f5f5]">
                      {selectedOrder.serviceDetails.fabricProvided
                        ? "Customer provided"
                        : "Studio fabric"}
                    </span>
                  </div>
                </div>
              )}

              {/* Pricing */}
              <div className="bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
                <h3 className="text-sm uppercase tracking-wider text-[#888888] mb-3 font-[family-name:var(--font-montserrat)]">
                  Pricing
                </h3>
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
                      {formatCurrency(selectedOrder.pricing.deliveryFee)}
                    </span>
                  </div>
                  {selectedOrder.pricing.discount && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount</span>
                      <span>
                        -
                        {selectedOrder.pricing.discount.type === "percentage"
                          ? `${selectedOrder.pricing.discount.value}%`
                          : formatCurrency(selectedOrder.pricing.discount.value)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-[#1a1a1a]">
                    <span className="text-[#f5f5f5] font-medium">Total</span>
                    <span className="text-[#c9a962]">
                      {formatCurrency(selectedOrder.pricing.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
                <h3 className="text-sm uppercase tracking-wider text-[#888888] mb-3 font-[family-name:var(--font-montserrat)]">
                  Payment
                </h3>
                <div className="space-y-3 text-sm font-[family-name:var(--font-montserrat)]">
                  {selectedOrder.pricing.depositAmount !== undefined && selectedOrder.pricing.depositAmount > 0 && (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[#888888]">Deposit: </span>
                        <span className="text-[#f5f5f5]">
                          {formatCurrency(selectedOrder.pricing.depositAmount)}
                        </span>
                      </div>
                      {selectedOrder.pricing.depositPaid ? (
                        <span className="text-green-400 text-xs">
                          Paid via {selectedOrder.pricing.depositMethod || "online"}
                        </span>
                      ) : (
                        <button
                          onClick={() => setShowPaymentModal("deposit")}
                          className="text-xs bg-[#c9a962] text-[#0a0a0a] px-3 py-1 hover:bg-[#d4b87a] transition-colors"
                        >
                          Record Payment
                        </button>
                      )}
                    </div>
                  )}
                  {selectedOrder.pricing.balanceAmount !== undefined && selectedOrder.pricing.balanceAmount > 0 && (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[#888888]">Balance: </span>
                        <span className="text-[#f5f5f5]">
                          {formatCurrency(selectedOrder.pricing.balanceAmount)}
                        </span>
                      </div>
                      {selectedOrder.pricing.balancePaid ? (
                        <span className="text-green-400 text-xs">
                          Paid via {selectedOrder.pricing.balanceMethod || "online"}
                        </span>
                      ) : selectedOrder.pricing.depositPaid ? (
                        <button
                          onClick={() => setShowPaymentModal("balance")}
                          className="text-xs bg-[#c9a962] text-[#0a0a0a] px-3 py-1 hover:bg-[#d4b87a] transition-colors"
                        >
                          Record Payment
                        </button>
                      ) : (
                        <span className="text-yellow-400 text-xs">
                          Awaiting deposit
                        </span>
                      )}
                    </div>
                  )}
                  {/* For orders without deposit/balance structure (full payment) */}
                  {(selectedOrder.pricing.depositAmount === undefined || selectedOrder.pricing.depositAmount === 0) && (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[#888888]">Total: </span>
                        <span className="text-[#f5f5f5]">
                          {formatCurrency(selectedOrder.pricing.totalAmount)}
                        </span>
                      </div>
                      {selectedOrder.pricing.depositPaid ? (
                        <span className="text-green-400 text-xs">
                          Paid via {selectedOrder.pricing.depositMethod || selectedOrder.paymentMethod}
                        </span>
                      ) : (
                        <button
                          onClick={() => setShowPaymentModal("deposit")}
                          className="text-xs bg-[#c9a962] text-[#0a0a0a] px-3 py-1 hover:bg-[#d4b87a] transition-colors"
                        >
                          Record Payment
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Payment Recording Modal */}
                {showPaymentModal && (
                  <div className="mt-4 p-4 bg-[#111111] border border-[#2a2a2a]">
                    <h4 className="text-sm text-[#f5f5f5] mb-3 font-[family-name:var(--font-montserrat)]">
                      Record {showPaymentModal === "deposit" ? "Deposit" : "Balance"} Payment
                    </h4>
                    <p className="text-xs text-[#888888] mb-3 font-[family-name:var(--font-montserrat)]">
                      Amount:{" "}
                      <span className="text-[#c9a962]">
                        {formatCurrency(
                          showPaymentModal === "deposit"
                            ? selectedOrder.pricing.depositAmount || selectedOrder.pricing.totalAmount
                            : selectedOrder.pricing.balanceAmount || 0
                        )}
                      </span>
                    </p>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                          Payment Method
                        </label>
                        <div className="flex gap-3">
                          <label className={`flex-1 flex items-center justify-center gap-2 p-2 border cursor-pointer transition-colors ${
                            paymentMethod === "cash"
                              ? "border-[#c9a962] bg-[#c9a962]/10"
                              : "border-[#2a2a2a] hover:border-[#3a3a3a]"
                          }`}>
                            <input
                              type="radio"
                              name="paymentMethod"
                              checked={paymentMethod === "cash"}
                              onChange={() => setPaymentMethod("cash")}
                              className="hidden"
                            />
                            <span className="text-sm text-[#f5f5f5]">Cash</span>
                          </label>
                          <label className={`flex-1 flex items-center justify-center gap-2 p-2 border cursor-pointer transition-colors ${
                            paymentMethod === "transfer"
                              ? "border-[#c9a962] bg-[#c9a962]/10"
                              : "border-[#2a2a2a] hover:border-[#3a3a3a]"
                          }`}>
                            <input
                              type="radio"
                              name="paymentMethod"
                              checked={paymentMethod === "transfer"}
                              onChange={() => setPaymentMethod("transfer")}
                              className="hidden"
                            />
                            <span className="text-sm text-[#f5f5f5]">Transfer</span>
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowPaymentModal(null)}
                          className="flex-1 border border-[#2a2a2a] text-[#888888] py-2 text-sm font-[family-name:var(--font-montserrat)] hover:border-[#3a3a3a] hover:text-[#f5f5f5] transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => recordPayment(showPaymentModal)}
                          disabled={recordingPayment}
                          className="flex-1 bg-[#c9a962] text-[#0a0a0a] py-2 text-sm font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors disabled:opacity-50"
                        >
                          {recordingPayment ? "Recording..." : "Confirm Payment"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery */}
              <div className="bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
                <h3 className="text-sm uppercase tracking-wider text-[#888888] mb-3 font-[family-name:var(--font-montserrat)]">
                  Delivery
                </h3>
                <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] capitalize">
                  {selectedOrder.deliveryMethod}
                </p>
                {selectedOrder.deliveryAddress && (
                  <p className="text-[#888888] text-sm mt-1 font-[family-name:var(--font-montserrat)]">
                    {selectedOrder.deliveryAddress.street},{" "}
                    {selectedOrder.deliveryAddress.city},{" "}
                    {selectedOrder.deliveryAddress.state}
                  </p>
                )}
              </div>

              {/* Customer Notes (read-only) */}
              {selectedOrder.notes && (
                <div className="bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
                  <h3 className="text-sm uppercase tracking-wider text-[#888888] mb-3 font-[family-name:var(--font-montserrat)]">
                    Customer Notes
                  </h3>
                  <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)]">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}

              {/* Admin Notes (editable) */}
              <div className="bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
                <h3 className="text-sm uppercase tracking-wider text-[#888888] mb-3 font-[family-name:var(--font-montserrat)]">
                  Admin Notes
                </h3>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about this order..."
                  rows={3}
                  className="w-full bg-[#111111] border border-[#2a2a2a] px-4 py-3 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none resize-none"
                />
                <button
                  onClick={saveAdminNotes}
                  disabled={savingNotes || adminNotes === (selectedOrder.adminNotes || "")}
                  className="mt-3 bg-[#c9a962] text-[#0a0a0a] px-4 py-2 text-sm font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingNotes ? "Saving..." : "Save Notes"}
                </button>
              </div>
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
