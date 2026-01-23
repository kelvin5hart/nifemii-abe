"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't apply layout to login page
  const isLoginPage = pathname === "/admin/login";

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  useEffect(() => {
    // Hide navbar and footer for admin pages
    const navbar = document.querySelector("body > nav, header nav, header");
    const footer = document.querySelector("body > footer, footer");

    if (navbar) (navbar as HTMLElement).style.display = "none";
    if (footer) (footer as HTMLElement).style.display = "none";

    return () => {
      // Restore navbar and footer when leaving admin
      if (navbar) (navbar as HTMLElement).style.display = "";
      if (footer) (footer as HTMLElement).style.display = "";
    };
  }, []);

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push("/admin/login");
    }
    // Redirect non-admin users
    if (!loading && user && !user.isAdmin && !isLoginPage) {
      router.push("/");
    }
  }, [user, loading, router, isLoginPage]);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Login page - no layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#c9a962] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#888888] font-[family-name:var(--font-montserrat)] text-sm">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated or not admin - show loading while redirecting
  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#c9a962] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#888888] font-[family-name:var(--font-montserrat)] text-sm">
            Redirecting...
          </p>
        </div>
      </div>
    );
  }

  // Authenticated admin - show layout with sidebar
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-30 bg-[#0a0a0a] border-b border-[#1a1a1a] px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-[#888888] hover:text-[#f5f5f5] transition-colors -ml-2"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-lg font-light tracking-[0.1em] text-[#f5f5f5] font-[family-name:var(--font-cormorant)]">
          NIFEMII <span className="text-[#c9a962]">ABE</span>
        </h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
