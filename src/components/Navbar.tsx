"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0a0a0a]/95 backdrop-blur-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group">
          <h1 className="text-2xl md:text-3xl font-light tracking-[0.2em] text-[#f5f5f5] font-[family-name:var(--font-cormorant)]">
            NIFEMII{" "}
            <span className="text-[#c9a962] group-hover:text-[#e5d4a1] transition-colors">
              ABE
            </span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-[0.15em] transition-colors duration-300 font-[family-name:var(--font-montserrat)] uppercase ${
                isActive(link.href)
                  ? "text-[#c9a962] border-b border-[#c9a962] pb-1"
                  : "text-[#888888] hover:text-[#c9a962]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {/* Account Button */}
          <Link
            href={user ? "/account" : "/account/login"}
            className="relative text-[#888888] hover:text-[#c9a962] transition-colors"
            aria-label={user ? "My Account" : "Sign In"}
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
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {user && (
              <span className="absolute -top-1 -right-1 bg-green-500 w-2 h-2 rounded-full"></span>
            )}
          </Link>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative text-[#888888] hover:text-[#c9a962] transition-colors"
            aria-label="Open cart"
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
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#c9a962] text-[#0a0a0a] text-xs w-5 h-5 rounded-full flex items-center justify-center font-[family-name:var(--font-montserrat)]">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Icons & Menu */}
        <div className="md:hidden flex items-center gap-3">
          {/* Mobile Account Button */}
          <Link
            href={user ? "/account" : "/account/login"}
            className="relative text-[#888888] hover:text-[#c9a962] transition-colors"
            aria-label={user ? "My Account" : "Sign In"}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {user && (
              <span className="absolute -top-1 -right-1 bg-green-500 w-2 h-2 rounded-full"></span>
            )}
          </Link>

          {/* Mobile Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative text-[#888888] hover:text-[#c9a962] transition-colors"
            aria-label="Open cart"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#c9a962] text-[#0a0a0a] text-xs w-4 h-4 rounded-full flex items-center justify-center font-[family-name:var(--font-montserrat)] text-[10px]">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            className="flex flex-col space-y-1.5 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
          <span
            className={`w-6 h-0.5 bg-[#f5f5f5] transition-all duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-[#f5f5f5] transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-[#f5f5f5] transition-all duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-[#0a0a0a]/98 backdrop-blur-sm transition-all duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      >
        <div className="px-6 py-8 flex flex-col space-y-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-lg tracking-[0.15em] transition-colors duration-300 font-[family-name:var(--font-montserrat)] uppercase ${
                isActive(link.href)
                  ? "text-[#c9a962]"
                  : "text-[#888888] hover:text-[#c9a962]"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {/* Account Link */}
          <Link
            href={user ? "/account" : "/account/login"}
            className={`text-lg tracking-[0.15em] transition-colors duration-300 font-[family-name:var(--font-montserrat)] uppercase ${
              pathname.startsWith("/account")
                ? "text-[#c9a962]"
                : "text-[#888888] hover:text-[#c9a962]"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {user ? "My Account" : "Sign In"}
          </Link>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer />
    </nav>
  );
}
