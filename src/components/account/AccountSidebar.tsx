"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  {
    href: "/account",
    label: "Dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: "/account/orders",
    label: "Orders",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    href: "/account/appointments",
    label: "Appointments",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: "/account/measurements",
    label: "Measurements",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: "/account/profile",
    label: "Profile",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <>
      {/* Mobile Navigation - Horizontal Scroll Tabs */}
      <div className="md:hidden bg-[#111111] border-b border-[#1a1a1a] sticky top-0 z-20">
        {/* User greeting row */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#c9a962]/20 flex items-center justify-center">
              <span className="text-[#c9a962] text-sm font-[family-name:var(--font-cormorant)]">
                {user?.name?.charAt(0) || user?.phone?.slice(-2) || "U"}
              </span>
            </div>
            <span className="text-[#f5f5f5] font-[family-name:var(--font-montserrat)] text-sm">
              {user?.name || "Welcome"}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="text-xs text-[#888888] hover:text-red-400 transition-colors font-[family-name:var(--font-montserrat)]"
          >
            Sign Out
          </button>
        </div>

        {/* Nav tabs */}
        <nav className="overflow-x-auto scrollbar-hide">
          <ul className="flex min-w-max px-2 py-2 gap-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/account" && pathname.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors font-[family-name:var(--font-montserrat)] text-xs whitespace-nowrap ${
                      isActive
                        ? "bg-[#c9a962]/20 text-[#c9a962]"
                        : "text-[#888888] hover:text-[#f5f5f5] hover:bg-[#1a1a1a]"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0">
        {/* User Info */}
        <div className="bg-[#111111] border border-[#1a1a1a] p-6 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#c9a962]/20 flex items-center justify-center">
              <span className="text-[#c9a962] text-lg font-[family-name:var(--font-cormorant)]">
                {user?.name?.charAt(0) || user?.phone?.slice(-2) || "U"}
              </span>
            </div>
            <div>
              <p className="text-[#f5f5f5] font-[family-name:var(--font-cormorant)] text-lg">
                {user?.name || "Welcome"}
              </p>
              <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
                {user?.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-[#111111] border border-[#1a1a1a]">
          <ul>
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/account" && pathname.startsWith(item.href));

              return (
                <li key={item.href} className="border-b border-[#1a1a1a] last:border-b-0">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-6 py-4 transition-colors font-[family-name:var(--font-montserrat)] text-sm ${
                      isActive
                        ? "bg-[#c9a962]/10 text-[#c9a962] border-l-2 border-[#c9a962]"
                        : "text-[#888888] hover:text-[#f5f5f5] hover:bg-[#0a0a0a]"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-6 py-4 text-[#888888] hover:text-red-400 transition-colors font-[family-name:var(--font-montserrat)] text-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
