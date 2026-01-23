"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

function VerifyPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [error, setError] = useState("");

  const reference = searchParams.get("reference");
  const trxref = searchParams.get("trxref");
  const paymentRef = reference || trxref;

  useEffect(() => {
    const verifyPayment = async () => {
      if (!paymentRef) {
        setStatus("failed");
        setError("No payment reference found");
        return;
      }

      try {
        // Verify payment with our API
        const response = await fetch(`/api/paystack/verify?reference=${paymentRef}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Verification failed");
        }

        if (data.status === "success") {
          // Update order in Firestore (webhook should have done this, but as backup)
          const orderId = data.metadata?.orderId;
          if (orderId) {
            try {
              await updateDoc(doc(db, "orders", orderId), {
                paymentStatus: "paid",
                paymentReference: paymentRef,
                paidAt: Timestamp.now(),
                status: "confirmed",
                updatedAt: Timestamp.now(),
              });
            } catch (updateError) {
              console.warn("Order update failed (webhook may have handled it):", updateError);
            }
          }

          setStatus("success");

          // Redirect to success page after brief delay
          setTimeout(() => {
            router.push(`/checkout/success?orderId=${orderId || ""}&paid=true`);
          }, 2000);
        } else {
          setStatus("failed");
          setError("Payment was not successful");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("failed");
        setError(err instanceof Error ? err.message : "Failed to verify payment");
      }
    };

    verifyPayment();
  }, [paymentRef, router]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-[#111111] border border-[#1a1a1a] p-8 text-center">
          {status === "loading" && (
            <>
              <div className="w-16 h-16 border-4 border-[#c9a962] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <h1 className="text-2xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-2">
                Verifying Payment
              </h1>
              <p className="text-[#888888] font-[family-name:var(--font-montserrat)]">
                Please wait while we confirm your payment...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-2">
                Payment Successful!
              </h1>
              <p className="text-[#888888] font-[family-name:var(--font-montserrat)]">
                Redirecting you to your order confirmation...
              </p>
            </>
          )}

          {status === "failed" && (
            <>
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-[family-name:var(--font-cormorant)] text-[#f5f5f5] mb-2">
                Payment Verification Failed
              </h1>
              <p className="text-[#888888] font-[family-name:var(--font-montserrat)] mb-6">
                {error}
              </p>
              <div className="space-y-3">
                <Link
                  href="/checkout"
                  className="block w-full bg-[#c9a962] text-[#0a0a0a] py-3 text-sm tracking-[0.1em] uppercase font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors"
                >
                  Try Again
                </Link>
                <Link
                  href="/shop"
                  className="block w-full border border-[#2a2a2a] text-[#888888] py-3 text-sm font-[family-name:var(--font-montserrat)] hover:border-[#3a3a3a] hover:text-[#f5f5f5] transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#c9a962] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyPaymentContent />
    </Suspense>
  );
}
