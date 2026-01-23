"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

type Step = "phone" | "otp" | "password-choice";
type LoginMethod = "otp" | "password";

export default function CustomerLoginPage() {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("otp");
  const [, setHasPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [testOtpCode, setTestOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { user, sendOTP, verifyOTPAndSignIn, checkHasPassword, loginWithPassword } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/account");
    }
  }, [user, router]);

  const formatPhoneDisplay = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits;
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Check if user has a password set
      const userHasPassword = await checkHasPassword(phone);
      setHasPassword(userHasPassword);

      if (userHasPassword) {
        // User has a password - show choice
        setStep("password-choice");
      } else {
        // No password - go directly to OTP
        const result = await sendOTP(phone);
        if (result.success) {
          setSuccess(result.message);
          if (result.testCode) {
            setTestOtpCode(result.testCode);
          }
          setStep("otp");
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to check account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginMethodSelect = async (method: LoginMethod) => {
    setLoginMethod(method);
    setError("");

    if (method === "otp") {
      setLoading(true);
      try {
        const result = await sendOTP(phone);
        if (result.success) {
          setSuccess(result.message);
          if (result.testCode) {
            setTestOtpCode(result.testCode);
          }
          setStep("otp");
        } else {
          setError(result.message);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to send OTP. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginWithPassword(phone, password);
      if (result.success) {
        router.push("/account");
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await verifyOTPAndSignIn(phone, otp);

      if (result.success) {
        router.push("/account");
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 6);
    setOtp(digits);
  };

  const resetToPhone = () => {
    setStep("phone");
    setOtp("");
    setPassword("");
    setError("");
    setSuccess("");
    setLoginMethod("otp");
    setTestOtpCode("");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-light tracking-[0.1em] text-[#f5f5f5] font-[family-name:var(--font-cormorant)]">
              NIFEMII <span className="text-[#c9a962]">ABE</span>
            </h1>
          </Link>
          <p className="text-[#888888] mt-2 font-[family-name:var(--font-montserrat)] text-sm">
            Sign in to your account
          </p>
        </div>

        <div className="bg-[#111111] border border-[#1a1a1a] p-8">
          {step === "phone" && (
            <>
              <h2 className="text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-2">
                Enter Your Phone Number
              </h2>
              <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)] mb-6">
                We&apos;ll verify your number to sign you in
              </p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 mb-6 text-sm font-[family-name:var(--font-montserrat)]">
                  {error}
                </div>
              )}

              <form onSubmit={handlePhoneSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]"
                  >
                    Phone Number
                  </label>
                  <div className="flex">
                    <span className="bg-[#1a1a1a] border border-[#2a2a2a] border-r-0 px-4 py-3 text-[#888888] font-[family-name:var(--font-montserrat)] text-sm">
                      +234
                    </span>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(formatPhoneDisplay(e.target.value))}
                      required
                      maxLength={11}
                      className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-3 text-[#f5f5f5] focus:border-[#c9a962] focus:outline-none transition-colors font-[family-name:var(--font-montserrat)] text-sm"
                      placeholder="8012345678"
                    />
                  </div>
                  <p className="text-[#666666] text-xs mt-2 font-[family-name:var(--font-montserrat)]">
                    Enter your number without the leading zero
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || phone.length < 10}
                  className="w-full bg-[#c9a962] text-[#0a0a0a] py-3 font-[family-name:var(--font-montserrat)] text-sm uppercase tracking-wider hover:bg-[#d4b87a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Checking..." : "Continue"}
                </button>
              </form>
            </>
          )}

          {step === "password-choice" && (
            <>
              <h2 className="text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-2">
                Welcome Back!
              </h2>
              <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)] mb-6">
                How would you like to sign in?
              </p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 mb-6 text-sm font-[family-name:var(--font-montserrat)]">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Password Login Option */}
                {loginMethod === "otp" ? (
                  <>
                    <button
                      onClick={() => setLoginMethod("password")}
                      disabled={loading}
                      className="w-full border border-[#c9a962] text-[#c9a962] py-3 font-[family-name:var(--font-montserrat)] text-sm uppercase tracking-wider hover:bg-[#c9a962]/10 transition-colors disabled:opacity-50"
                    >
                      Sign in with Password
                    </button>
                    <button
                      onClick={() => handleLoginMethodSelect("otp")}
                      disabled={loading}
                      className="w-full bg-[#c9a962] text-[#0a0a0a] py-3 font-[family-name:var(--font-montserrat)] text-sm uppercase tracking-wider hover:bg-[#d4b87a] transition-colors disabled:opacity-50"
                    >
                      {loading ? "Sending OTP..." : "Sign in with OTP"}
                    </button>
                  </>
                ) : (
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-3 pr-12 text-[#f5f5f5] focus:border-[#c9a962] focus:outline-none transition-colors font-[family-name:var(--font-montserrat)] text-sm"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#c9a962] transition-colors"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading || password.length < 6}
                      className="w-full bg-[#c9a962] text-[#0a0a0a] py-3 font-[family-name:var(--font-montserrat)] text-sm uppercase tracking-wider hover:bg-[#d4b87a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Signing in..." : "Sign In"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMethod("otp");
                        setPassword("");
                        setError("");
                      }}
                      className="w-full text-[#888888] hover:text-[#c9a962] py-2 font-[family-name:var(--font-montserrat)] text-sm transition-colors"
                    >
                      Use OTP instead
                    </button>
                  </form>
                )}

                <button
                  type="button"
                  onClick={resetToPhone}
                  className="w-full text-[#888888] hover:text-[#c9a962] py-2 font-[family-name:var(--font-montserrat)] text-sm transition-colors"
                >
                  ← Change Phone Number
                </button>
              </div>
            </>
          )}

          {step === "otp" && (
            <>
              <h2 className="text-xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-2">
                Enter Verification Code
              </h2>
              <p className="text-[#888888] text-sm font-[family-name:var(--font-montserrat)] mb-6">
                We sent a code to +234{phone}
              </p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 mb-6 text-sm font-[family-name:var(--font-montserrat)]">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 mb-6 text-sm font-[family-name:var(--font-montserrat)]">
                  {success}
                </div>
              )}

              {testOtpCode && (
                <div className="bg-[#c9a962]/10 border border-[#c9a962]/50 px-4 py-4 mb-6 text-center">
                  <p className="text-[#888888] text-xs font-[family-name:var(--font-montserrat)] mb-1">
                    TESTING MODE - Your OTP Code:
                  </p>
                  <p className="text-[#c9a962] text-2xl font-bold tracking-[0.3em] font-[family-name:var(--font-montserrat)]">
                    {testOtpCode}
                  </p>
                  <p className="text-[#666666] text-xs font-[family-name:var(--font-montserrat)] mt-2">
                    This will be sent via SMS in production
                  </p>
                </div>
              )}

              <form onSubmit={handleOTPSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm text-[#888888] mb-2 font-[family-name:var(--font-montserrat)]"
                  >
                    6-Digit Code
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => handleOTPChange(e.target.value)}
                    required
                    maxLength={6}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-3 text-[#f5f5f5] focus:border-[#c9a962] focus:outline-none transition-colors font-[family-name:var(--font-montserrat)] text-sm text-center tracking-[0.5em] text-lg"
                    placeholder="000000"
                  />
                  <p className="text-[#666666] text-xs mt-2 font-[family-name:var(--font-montserrat)]">
                    Code expires in 5 minutes
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-[#c9a962] text-[#0a0a0a] py-3 font-[family-name:var(--font-montserrat)] text-sm uppercase tracking-wider hover:bg-[#d4b87a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Verifying..." : "Verify & Sign In"}
                </button>

                <button
                  type="button"
                  onClick={resetToPhone}
                  className="w-full text-[#888888] hover:text-[#c9a962] py-2 font-[family-name:var(--font-montserrat)] text-sm transition-colors"
                >
                  ← Change Phone Number
                </button>
              </form>
            </>
          )}
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
