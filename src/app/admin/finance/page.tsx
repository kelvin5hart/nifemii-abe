"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Order } from "@/lib/firebase-types";
import Link from "next/link";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
};

const formatDate = (date: Date | Timestamp) => {
  const d = date instanceof Timestamp ? date.toDate() : date;
  return d.toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

type PaymentMethod = "paystack" | "cash" | "transfer" | "all";
type PaymentStatus = "paid" | "pending" | "all";

interface PaymentRecord {
  orderId: string;
  orderRef: string;
  customerName: string;
  customerPhone: string;
  type: "deposit" | "balance" | "full";
  amount: number;
  method: string;
  status: "paid" | "pending";
  date?: Date;
  orderDate: Date;
}

export default function AdminFinancePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMethod, setFilterMethod] = useState<PaymentMethod>("all");
  const [filterStatus, setFilterStatus] = useState<PaymentStatus>("all");
  const [dateRange, setDateRange] = useState<"all" | "today" | "week" | "month">("month");

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
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date(),
        } as Order;
      });
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter orders by date range
  const getDateFilteredOrders = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return orders.filter((order) => {
      if (order.status === "cancelled") return false;

      const orderDate = order.createdAt instanceof Date ? order.createdAt : new Date();

      switch (dateRange) {
        case "today":
          return orderDate >= today;
        case "week":
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return orderDate >= weekAgo;
        case "month":
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return orderDate >= monthAgo;
        default:
          return true;
      }
    });
  };

  // Generate payment records from orders
  const getPaymentRecords = (): PaymentRecord[] => {
    const records: PaymentRecord[] = [];
    const filteredOrders = getDateFilteredOrders();

    filteredOrders.forEach((order) => {
      const pricing = order.pricing;
      if (!pricing) return;

      const baseRecord = {
        orderId: order.id,
        orderRef: `#${order.id.slice(0, 8)}`,
        customerName: order.userName || "Unknown",
        customerPhone: order.userPhone,
        orderDate: order.createdAt instanceof Date ? order.createdAt : new Date(),
      };

      // Check if order has deposit/balance structure
      if (pricing.depositAmount !== undefined && pricing.depositAmount > 0) {
        // Deposit record
        records.push({
          ...baseRecord,
          type: "deposit",
          amount: pricing.depositAmount,
          method: pricing.depositMethod || "pending",
          status: pricing.depositPaid ? "paid" : "pending",
          date: pricing.depositDate instanceof Timestamp
            ? pricing.depositDate.toDate()
            : pricing.depositPaid
            ? order.createdAt instanceof Date ? order.createdAt : new Date()
            : undefined,
        });

        // Balance record (if exists)
        const balanceAmount = pricing.balanceAmount || 0;
        if (balanceAmount > 0) {
          records.push({
            ...baseRecord,
            type: "balance",
            amount: balanceAmount,
            method: pricing.balanceMethod || "pending",
            status: pricing.balancePaid ? "paid" : "pending",
            date: pricing.balanceDate instanceof Timestamp
              ? pricing.balanceDate.toDate()
              : pricing.balancePaid
              ? order.updatedAt instanceof Date ? order.updatedAt : new Date()
              : undefined,
          });
        }
      } else {
        // Full payment
        records.push({
          ...baseRecord,
          type: "full",
          amount: pricing.totalAmount,
          method: pricing.depositMethod || order.paymentMethod || "pending",
          status: pricing.depositPaid ? "paid" : "pending",
          date: pricing.depositDate instanceof Timestamp
            ? pricing.depositDate.toDate()
            : pricing.depositPaid
            ? order.createdAt instanceof Date ? order.createdAt : new Date()
            : undefined,
        });
      }
    });

    // Filter by method
    let filtered = records;
    if (filterMethod !== "all") {
      filtered = filtered.filter((r) => r.method === filterMethod);
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((r) => r.status === filterStatus);
    }

    // Sort by date (most recent first)
    return filtered.sort((a, b) => {
      const dateA = a.date || a.orderDate;
      const dateB = b.date || b.orderDate;
      return dateB.getTime() - dateA.getTime();
    });
  };

  // Calculate totals
  const calculateTotals = () => {
    const records = getPaymentRecords();

    const paidTotal = records
      .filter((r) => r.status === "paid")
      .reduce((sum, r) => sum + r.amount, 0);

    const pendingTotal = records
      .filter((r) => r.status === "pending")
      .reduce((sum, r) => sum + r.amount, 0);

    // Group by payment method (only paid amounts)
    const byMethod: Record<string, number> = {};
    records
      .filter((r) => r.status === "paid")
      .forEach((r) => {
        byMethod[r.method] = (byMethod[r.method] || 0) + r.amount;
      });

    return { paidTotal, pendingTotal, byMethod };
  };

  const totals = calculateTotals();
  const paymentRecords = getPaymentRecords();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#888888]">Loading financial data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
            Finance
          </h1>
          <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
            Track payments received and outstanding
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111111] border border-[#1a1a1a] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-green-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-green-400 text-xs font-[family-name:var(--font-montserrat)]">
              Received
            </span>
          </div>
          <p className="text-2xl font-[family-name:var(--font-cormorant)] text-green-400 mb-1">
            {formatPrice(totals.paidTotal)}
          </p>
          <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
            Total Paid
          </p>
        </div>

        <div className="bg-[#111111] border border-[#1a1a1a] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-yellow-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-yellow-400 text-xs font-[family-name:var(--font-montserrat)]">
              Outstanding
            </span>
          </div>
          <p className="text-2xl font-[family-name:var(--font-cormorant)] text-yellow-400 mb-1">
            {formatPrice(totals.pendingTotal)}
          </p>
          <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
            Pending Payments
          </p>
        </div>

        <div className="bg-[#111111] border border-[#1a1a1a] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[#c9a962]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[#c9a962] text-xs font-[family-name:var(--font-montserrat)]">
              Combined
            </span>
          </div>
          <p className="text-2xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-1">
            {formatPrice(totals.paidTotal + totals.pendingTotal)}
          </p>
          <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
            Total Value
          </p>
        </div>
      </div>

      {/* Payment Method Breakdown */}
      {Object.keys(totals.byMethod).length > 0 && (
        <div className="bg-[#111111] border border-[#1a1a1a] p-6">
          <h2 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-4">
            Revenue by Payment Method
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(totals.byMethod).map(([method, amount]) => (
              <div key={method} className="bg-[#0a0a0a] p-4 border border-[#1a1a1a]">
                <p className="text-[#888888] text-xs uppercase tracking-wider font-[family-name:var(--font-montserrat)] mb-2">
                  {method === "paystack" ? "Paystack (Online)" : method.charAt(0).toUpperCase() + method.slice(1)}
                </p>
                <p className="text-[#c9a962] text-lg font-[family-name:var(--font-montserrat)]">
                  {formatPrice(amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
          className="bg-[#111111] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
        >
          <option value="today">Today</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="all">All Time</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as PaymentStatus)}
          className="bg-[#111111] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid Only</option>
          <option value="pending">Pending Only</option>
        </select>

        <select
          value={filterMethod}
          onChange={(e) => setFilterMethod(e.target.value as PaymentMethod)}
          className="bg-[#111111] border border-[#2a2a2a] px-4 py-2 text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] focus:border-[#c9a962] focus:outline-none"
        >
          <option value="all">All Methods</option>
          <option value="paystack">Paystack</option>
          <option value="cash">Cash</option>
          <option value="transfer">Transfer</option>
        </select>
      </div>

      {/* Payment Records Table */}
      <div className="bg-[#111111] border border-[#1a1a1a] overflow-hidden">
        <div className="p-4 border-b border-[#1a1a1a]">
          <h2 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
            Payment Records ({paymentRecords.length})
          </h2>
        </div>

        {paymentRecords.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[#888888] font-[family-name:var(--font-montserrat)]">
              No payment records found for the selected filters
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-[#1a1a1a]">
              {paymentRecords.map((record, idx) => (
                <div
                  key={`${record.orderId}-${record.type}-${idx}`}
                  className="p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Link
                        href="/admin/orders"
                        className="text-[#c9a962] text-sm font-[family-name:var(--font-montserrat)] hover:underline"
                      >
                        {record.orderRef}
                      </Link>
                      <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] mt-1">
                        {record.customerName}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs border font-[family-name:var(--font-montserrat)] ${
                        record.status === "paid"
                          ? "bg-green-500/20 text-green-400 border-green-500/50"
                          : "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                      }`}
                    >
                      {record.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#c9a962] font-[family-name:var(--font-montserrat)]">
                      {formatPrice(record.amount)}
                    </span>
                    <span className="text-[#888888] font-[family-name:var(--font-montserrat)] capitalize">
                      {record.type} · {record.method || "-"}
                    </span>
                  </div>
                  {record.date && (
                    <p className="text-xs text-[#666666] mt-2 font-[family-name:var(--font-montserrat)]">
                      {formatDate(record.date)}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0a0a0a] border-b border-[#1a1a1a]">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#888888] font-[family-name:var(--font-montserrat)]">
                      Order
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
                      Method
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#888888] font-[family-name:var(--font-montserrat)]">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#888888] font-[family-name:var(--font-montserrat)]">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]">
                  {paymentRecords.map((record, idx) => (
                    <tr
                      key={`${record.orderId}-${record.type}-${idx}`}
                      className="hover:bg-[#1a1a1a]/50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <Link
                          href="/admin/orders"
                          className="text-[#c9a962] text-sm font-[family-name:var(--font-montserrat)] hover:underline"
                        >
                          {record.orderRef}
                        </Link>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)]">
                          {record.customerName}
                        </p>
                        <p className="text-[#888888] text-xs font-[family-name:var(--font-montserrat)]">
                          {record.customerPhone}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-sm text-[#888888] font-[family-name:var(--font-montserrat)] capitalize">
                        {record.type}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
                        {formatPrice(record.amount)}
                      </td>
                      <td className="px-4 py-4 text-sm font-[family-name:var(--font-montserrat)] capitalize">
                        {record.status === "pending" ? (
                          <span className="text-[#666666]">-</span>
                        ) : (
                          <span className="text-[#888888]">
                            {record.method === "paystack" ? "Paystack" : record.method}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2 py-1 text-xs border font-[family-name:var(--font-montserrat)] ${
                            record.status === "paid"
                              ? "bg-green-500/20 text-green-400 border-green-500/50"
                              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-[#888888] font-[family-name:var(--font-montserrat)]">
                        {record.date ? formatDate(record.date) : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
