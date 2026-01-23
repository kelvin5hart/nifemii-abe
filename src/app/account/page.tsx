"use client";

import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Order, Appointment } from "@/lib/firebase-types";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
};

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

export default function AccountDashboardPage() {
  const { user, setPassword } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Stats
  const [activeOrders, setActiveOrders] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState(0);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.phone) {
      setLoading(false);
      return;
    }

    // Listen to user's orders
    const ordersQuery = query(
      collection(db, "orders"),
      where("userPhone", "==", user.phone),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      })) as Order[];

      // Count active orders (not delivered or cancelled)
      const active = orders.filter(
        (o) => !["delivered", "cancelled"].includes(o.status)
      ).length;

      setActiveOrders(active);
      setRecentOrders(orders);
      setLoading(false);
    }, () => {
      setLoading(false);
    });

    // Listen to user's upcoming appointments
    const today = new Date().toISOString().split("T")[0];
    const appointmentsQuery = query(
      collection(db, "appointments"),
      where("userPhone", "==", user.phone),
      where("date", ">=", today),
      where("status", "in", ["pending", "confirmed"])
    );

    const unsubAppointments = onSnapshot(appointmentsQuery, (snapshot) => {
      const apts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Appointment[];

      setUpcomingAppointments(apts.length);
      setAppointments(apts.slice(0, 3));
    }, () => {
      // Index may not exist
    });

    return () => {
      unsubOrders();
      unsubAppointments();
    };
  }, [user?.phone]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      const result = await setPassword(newPassword);
      if (result.success) {
        setPasswordSuccess(result.message);
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordForm(false);
      } else {
        setPasswordError(result.message);
      }
    } catch {
      setPasswordError("Failed to set password. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
            Welcome{user?.name ? `, ${user.name}` : ""}!
          </h1>
          <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
            Manage your orders, appointments, and profile
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link
            href="/account/orders"
            className="bg-[#111111] border border-[#1a1a1a] p-6 hover:border-[#c9a962]/50 transition-colors"
          >
            <p className="text-2xl font-[family-name:var(--font-cormorant)] text-[#c9a962] mb-1">
              {loading ? "..." : activeOrders}
            </p>
            <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
              Active Orders
            </p>
          </Link>
          <Link
            href="/account/appointments"
            className="bg-[#111111] border border-[#1a1a1a] p-6 hover:border-[#c9a962]/50 transition-colors"
          >
            <p className="text-2xl font-[family-name:var(--font-cormorant)] text-[#c9a962] mb-1">
              {loading ? "..." : upcomingAppointments}
            </p>
            <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
              Upcoming Appointments
            </p>
          </Link>
          <Link
            href="/account/profile"
            className="bg-[#111111] border border-[#1a1a1a] p-6 hover:border-[#c9a962]/50 transition-colors"
          >
            <p className="text-2xl font-[family-name:var(--font-cormorant)] text-[#c9a962] mb-1">
              {user?.name ? "Complete" : "Incomplete"}
            </p>
            <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
              Profile
            </p>
          </Link>
        </div>

        {/* Password Setup Card - Only show if user doesn't have password */}
        {!user?.hasPassword && (
          <div className="bg-[#c9a962]/10 border border-[#c9a962]/30 p-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[#c9a962] font-[family-name:var(--font-cormorant)] text-lg mb-1">
                  Set Up Password Login
                </h3>
                <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                  Create a password to sign in faster without OTP each time
                </p>
              </div>
              {!showPasswordForm && (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="text-[#c9a962] text-sm font-[family-name:var(--font-montserrat)] hover:underline whitespace-nowrap ml-4"
                >
                  Set Password
                </button>
              )}
            </div>

            {showPasswordForm && (
              <form onSubmit={handleSetPassword} className="mt-4 space-y-4">
                {passwordError && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 text-sm font-[family-name:var(--font-montserrat)]">
                    {passwordError}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 pr-10 text-[#f5f5f5] focus:border-[#c9a962] focus:outline-none transition-colors font-[family-name:var(--font-montserrat)] text-sm"
                        placeholder="Min 6 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#c9a962] transition-colors"
                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                      >
                        {showNewPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 pr-10 text-[#f5f5f5] focus:border-[#c9a962] focus:outline-none transition-colors font-[family-name:var(--font-montserrat)] text-sm"
                        placeholder="Repeat password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#c9a962] transition-colors"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="bg-[#c9a962] text-[#0a0a0a] px-6 py-2 font-[family-name:var(--font-montserrat)] text-sm uppercase tracking-wider hover:bg-[#d4b87a] transition-colors disabled:opacity-50"
                  >
                    {passwordLoading ? "Setting..." : "Set Password"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setNewPassword("");
                      setConfirmPassword("");
                      setPasswordError("");
                    }}
                    className="text-[#888888] px-4 py-2 font-[family-name:var(--font-montserrat)] text-sm hover:text-[#f5f5f5] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Password Already Set */}
        {user?.hasPassword && passwordSuccess && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 mb-6 text-sm font-[family-name:var(--font-montserrat)]">
            {passwordSuccess}
          </div>
        )}

        {/* Recent Orders */}
        <div className="bg-[#111111] border border-[#1a1a1a] p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-[family-name:var(--font-cormorant)] text-[#f5f5f5]">
              Recent Orders
            </h2>
            <Link
              href="/account/orders"
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)] mb-4">
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
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href="/account/orders"
                  className="flex items-center justify-between p-3 bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-colors"
                >
                  <div>
                    <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)]">
                      #{order.id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-[#888888] text-xs font-[family-name:var(--font-montserrat)]">
                      {order.type.replace("-", " ")}
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
              href="/account/appointments"
              className="text-[#c9a962] text-sm font-[family-name:var(--font-montserrat)] hover:underline"
            >
              View All
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-[#c9a962] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : appointments.length === 0 ? (
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
              <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)] mb-4">
                No upcoming appointments
              </p>
              <Link
                href="/account/appointments/book"
                className="inline-block bg-[#c9a962] text-[#0a0a0a] px-6 py-2 font-[family-name:var(--font-montserrat)] text-sm uppercase tracking-wider hover:bg-[#d4b87a] transition-colors"
              >
                Book Consultation
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((apt) => (
                <Link
                  key={apt.id}
                  href="/account/appointments"
                  className="flex items-center justify-between p-3 bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-colors"
                >
                  <div>
                    <p className="text-[#f5f5f5] text-sm font-[family-name:var(--font-montserrat)] capitalize">
                      {apt.type.replace("-", " ")}
                    </p>
                    <p className="text-[#888888] text-xs font-[family-name:var(--font-montserrat)]">
                      {apt.timeSlot}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#c9a962] text-sm font-[family-name:var(--font-montserrat)]">
                      {apt.date}
                    </p>
                    <span className={`inline-block px-2 py-0.5 text-xs ${getStatusColor(apt.status)}`}>
                      {apt.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
  );
}
