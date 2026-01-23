"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { adminLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await adminLogin(email, password);
      router.push("/admin");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-light tracking-[0.1em] text-[#f5f5f5] font-[family-name:var(--font-cormorant)]">
              NIFEMII <span className="text-[#c9a962]">ABE</span>
            </h1>
          </Link>
          <p className="text-[#888888] mt-2 font-[family-name:var(--font-montserrat)] text-sm">
            Admin Portal
          </p>
        </div>

        <div className="bg-[#111111] border border-[#1a1a1a] p-8">
          <h2 className="text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-6">
            Sign In
          </h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 mb-6 text-sm font-[family-name:var(--font-montserrat)]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-3 text-[#f5f5f5] focus:border-[#c9a962] focus:outline-none transition-colors font-[family-name:var(--font-montserrat)] text-sm"
                placeholder="admin@nifemiiabe.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-3 text-[#f5f5f5] focus:border-[#c9a962] focus:outline-none transition-colors font-[family-name:var(--font-montserrat)] text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c9a962] text-[#0a0a0a] py-3 font-[family-name:var(--font-montserrat)] text-sm uppercase tracking-wider hover:bg-[#d4b87a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-[#888888] text-sm font-[family-name:var(--font-montserrat)]">
          <Link href="/" className="hover:text-[#c9a962] transition-colors">
            ← Back to Website
          </Link>
        </p>
      </div>
    </div>
  );
}
