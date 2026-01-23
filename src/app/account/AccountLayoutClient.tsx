"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AccountSidebar from "@/components/account/AccountSidebar";

export default function AccountLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Don't apply layout to login page
  const isLoginPage = pathname === "/account/login";

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push("/account/login");
    }
  }, [user, loading, router, isLoginPage]);

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

  // Not authenticated
  if (!user) {
    return null;
  }

  // Authenticated - show layout with sidebar
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-16 md:pt-20">
      {/* Mobile navigation is sticky at top - rendered by AccountSidebar */}
      <div className="md:hidden">
        <AccountSidebar />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop sidebar */}
          <div className="hidden md:block">
            <AccountSidebar />
          </div>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
