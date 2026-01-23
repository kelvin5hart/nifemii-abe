"use client";

import { useState, useEffect } from "react";
import { collection, query, where, orderBy, limit, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Order, Appointment } from "@/lib/firebase-types";
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

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    paidRevenue: 0,
    pendingRevenue: 0,
    ordersThisMonth: 0,
    customersThisMonth: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get start of current month for comparisons
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Listen to orders
    const ordersQuery = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );

    const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      })) as Order[];

      // Calculate stats
      const totalOrders = orders.length;
      const pendingOrders = orders.filter((o) => o.status === "pending").length;

      // Calculate paid and pending revenue
      let paidRevenue = 0;
      let pendingRevenue = 0;

      orders.filter((o) => o.status !== "cancelled").forEach((order) => {
        const pricing = order.pricing;
        if (!pricing) return;

        // Check if order has deposit/balance structure
        if (pricing.depositAmount !== undefined && pricing.depositAmount > 0) {
          // Deposit paid
          if (pricing.depositPaid) {
            paidRevenue += pricing.depositAmount;
          } else {
            pendingRevenue += pricing.depositAmount;
          }
          // Balance paid
          const balanceAmount = pricing.balanceAmount || 0;
          if (balanceAmount > 0) {
            if (pricing.balancePaid) {
              paidRevenue += balanceAmount;
            } else {
              pendingRevenue += balanceAmount;
            }
          }
        } else {
          // Full payment structure
          if (pricing.depositPaid) {
            paidRevenue += pricing.totalAmount;
          } else {
            pendingRevenue += pricing.totalAmount;
          }
        }
      });

      const ordersThisMonth = orders.filter((o) => {
        const orderDate = o.createdAt instanceof Timestamp ? o.createdAt.toDate() : o.createdAt;
        return orderDate >= startOfMonth;
      }).length;

      setStats((prev) => ({
        ...prev,
        totalOrders,
        pendingOrders,
        paidRevenue,
        pendingRevenue,
        ordersThisMonth,
      }));

      // Recent orders (last 5)
      setRecentOrders(orders.slice(0, 5));
    });

    // Listen to all users and filter out admins client-side
    // This avoids needing a composite index for isAdmin != true
    const customersQuery = query(collection(db, "users"));

    const unsubCustomers = onSnapshot(customersQuery, (snapshot) => {
      // Filter out admins - include users without isAdmin field (they're customers)
      const customerDocs = snapshot.docs.filter((doc) => {
        const data = doc.data();
        return data.isAdmin !== true;
      });

      const totalCustomers = customerDocs.length;
      const customersThisMonth = customerDocs.filter((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate?.() || new Date(0);
        return createdAt >= startOfMonth;
      }).length;

      setStats((prev) => ({
        ...prev,
        totalCustomers,
        customersThisMonth,
      }));
    });

    // Listen to upcoming appointments
    const today = new Date().toISOString().split("T")[0];
    const appointmentsQuery = query(
      collection(db, "appointments"),
      where("date", ">=", today),
      where("status", "in", ["pending", "confirmed"]),
      orderBy("date", "asc"),
      limit(5)
    );

    const unsubAppointments = onSnapshot(appointmentsQuery, (snapshot) => {
      const appointments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Appointment[];
      setUpcomingAppointments(appointments);
      setLoading(false);
    }, () => {
      // Index may not exist, just set loading to false
      setLoading(false);
    });

    return () => {
      unsubOrders();
      unsubCustomers();
      unsubAppointments();
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "confirmed":
        return "bg-blue-500/20 text-blue-400";
      case "in-progress":
        return "bg-purple-500/20 text-purple-400";
      case "ready":
        return "bg-green-500/20 text-green-400";
      case "delivered":
        return "bg-green-500/20 text-green-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-[#2a2a2a] text-[#888888]";
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
          Dashboard
        </h1>
        <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
          Welcome back! Here&apos;s an overview of your business.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#111111] border border-[#1a1a1a] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[#c9a962]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-[#888888] text-xs font-[family-name:var(--font-montserrat)]">
              +{stats.ordersThisMonth} this month
            </span>
          </div>
          <p className="text-2xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-1">
            {loading ? "..." : stats.totalOrders}
          </p>
          <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
            Total Orders
          </p>
        </div>

        <div className="bg-[#111111] border border-[#1a1a1a] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[#c9a962]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className={`text-xs font-[family-name:var(--font-montserrat)] ${stats.pendingOrders > 0 ? "text-yellow-400" : "text-[#888888]"}`}>
              {stats.pendingOrders > 0 ? "Needs attention" : "All clear"}
            </span>
          </div>
          <p className="text-2xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-1">
            {loading ? "..." : stats.pendingOrders}
          </p>
          <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
            Pending Orders
          </p>
        </div>

        <div className="bg-[#111111] border border-[#1a1a1a] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[#c9a962]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-[#888888] text-xs font-[family-name:var(--font-montserrat)]">
              +{stats.customersThisMonth} this month
            </span>
          </div>
          <p className="text-2xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-1">
            {loading ? "..." : stats.totalCustomers}
          </p>
          <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
            Total Customers
          </p>
        </div>

        <Link href="/admin/finance" className="bg-[#111111] border border-[#1a1a1a] p-6 hover:border-[#c9a962]/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[#c9a962]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-green-400 text-xs font-[family-name:var(--font-montserrat)]">
              Paid
            </span>
          </div>
          <p className="text-2xl font-[family-name:var(--font-cormorant)] text-green-400 mb-1">
            {loading ? "..." : formatPrice(stats.paidRevenue)}
          </p>
          <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
            Revenue Received
          </p>
          {stats.pendingRevenue > 0 && (
            <p className="text-yellow-400 text-xs mt-2 font-[family-name:var(--font-montserrat)]">
              {formatPrice(stats.pendingRevenue)} pending
            </p>
          )}
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Orders */}
        <div className="bg-[#111111] border border-[#1a1a1a] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-[#c9a962] text-sm font-[family-name:var(--font-montserrat)] hover:underline"
            >
              View All
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-[#c9a962] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <svg
                className="w-12 h-12 text-[#2a2a2a] mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                No orders yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href="/admin/orders"
                  className="flex items-center justify-between p-3 bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-colors"
                >
                  <div>
                    <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)]">
                      #{order.id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-[#888888] text-xs font-[family-name:var(--font-montserrat)]">
                      {order.userName || order.userPhone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#c9a962] text-sm font-[family-name:var(--font-montserrat)]">
                      {formatPrice(order.pricing?.totalAmount || 0)}
                    </p>
                    <span className={`inline-block px-2 py-0.5 text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-[#111111] border border-[#1a1a1a] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
              Upcoming Appointments
            </h2>
            <Link
              href="/admin/appointments"
              className="text-[#c9a962] text-sm font-[family-name:var(--font-montserrat)] hover:underline"
            >
              View All
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-[#c9a962] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <svg
                className="w-12 h-12 text-[#2a2a2a] mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                No appointments scheduled
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <Link
                  key={apt.id}
                  href="/admin/appointments"
                  className="flex items-center justify-between p-3 bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-colors"
                >
                  <div>
                    <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] capitalize">
                      {apt.type.replace("-", " ")}
                    </p>
                    <p className="text-[#888888] text-xs font-[family-name:var(--font-montserrat)]">
                      {apt.userName || apt.userPhone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#c9a962] text-sm font-[family-name:var(--font-montserrat)]">
                      {apt.date}
                    </p>
                    <p className="text-[#888888] text-xs font-[family-name:var(--font-montserrat)]">
                      {apt.timeSlot}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#111111] border border-[#1a1a1a] p-6">
        <h2 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/orders/new"
            className="flex flex-col items-center justify-center p-4 bg-[#0a0a0a] border border-[#2a2a2a] hover:border-[#c9a962] transition-colors text-center"
          >
            <span className="text-2xl text-[#c9a962] mb-2">+</span>
            <span className="text-sm text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
              New Order
            </span>
          </Link>
          <Link
            href="/admin/products"
            className="flex flex-col items-center justify-center p-4 bg-[#0a0a0a] border border-[#2a2a2a] hover:border-[#c9a962] transition-colors text-center"
          >
            <span className="text-2xl text-[#c9a962] mb-2">+</span>
            <span className="text-sm text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
              Add Product
            </span>
          </Link>
          <Link
            href="/admin/customers"
            className="flex flex-col items-center justify-center p-4 bg-[#0a0a0a] border border-[#2a2a2a] hover:border-[#c9a962] transition-colors text-center"
          >
            <span className="text-2xl text-[#c9a962] mb-2">+</span>
            <span className="text-sm text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
              Add Customer
            </span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex flex-col items-center justify-center p-4 bg-[#0a0a0a] border border-[#2a2a2a] hover:border-[#c9a962] transition-colors text-center"
          >
            <span className="text-2xl text-[#c9a962] mb-2">⚙</span>
            <span className="text-sm text-[#f5f5f5] font-[family-name:var(--font-montserrat)]">
              Settings
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
