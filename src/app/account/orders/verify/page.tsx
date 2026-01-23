"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { doc, updateDoc, getDoc, Timestamp } from "firebase/firestore";
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
          const orderId = data.metadata?.orderId;
          const paymentType = data.metadata?.paymentType || "full";
          const amountPaid = data.amount / 100; // Convert from kobo to Naira

          if (orderId) {
            try {
              // Get current order to update correctly
              const orderDoc = await getDoc(doc(db, "orders", orderId));

              if (orderDoc.exists()) {
                const orderData = orderDoc.data();
                const updateData: Record<string, unknown> = {
                  updatedAt: Timestamp.now(),
                };

                if (paymentType === "deposit") {
                  // Mark deposit as paid
                  updateData["pricing.depositPaid"] = true;
                  updateData["pricing.depositMethod"] = "paystack";
                  updateData["pricing.depositDate"] = Timestamp.now();
                  updateData["pricing.depositPaymentRef"] = paymentRef;
                  // Confirm order when deposit is paid
                  if (orderData.status === "pending") {
                    updateData.status = "confirmed";
                  }
                } else if (paymentType === "balance") {
                  // Mark balance as paid
                  updateData["pricing.balancePaid"] = true;
                  updateData["pricing.balanceMethod"] = "paystack";
                  updateData["pricing.balanceDate"] = Timestamp.now();
                  updateData["pricing.balancePaymentRef"] = paymentRef;
                } else {
                  // Full payment - mark both deposit and balance as paid
                  updateData["pricing.depositPaid"] = true;
                  updateData["pricing.depositAmount"] = amountPaid;
                  updateData["pricing.depositMethod"] = "paystack";
                  updateData["pricing.depositDate"] = Timestamp.now();
                  updateData["pricing.depositPaymentRef"] = paymentRef;
                  updateData["pricing.balanceAmount"] = 0;
                  updateData["pricing.balancePaid"] = true;
                  // Confirm order
                  if (orderData.status === "pending") {
                    updateData.status = "confirmed";
                  }
                }

                await updateDoc(doc(db, "orders", orderId), updateData);
              }
            } catch (updateError) {
              console.warn("Order update failed (webhook may have handled it):", updateError);
            }
          }

          setStatus("success");

          // Redirect back to orders page after brief delay
          setTimeout(() => {
            router.push("/account/orders");
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
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md w-full">
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
                Redirecting you back to your orders...
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
              <Link
                href="/account/orders"
                className="block w-full bg-[#c9a962] text-[#0a0a0a] py-3 text-sm tracking-[0.1em] uppercase font-[family-name:var(--font-montserrat)] hover:bg-[#d4b87a] transition-colors"
              >
                Back to Orders
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyOrderPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-[#c9a962] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyPaymentContent />
    </Suspense>
  );
}
