import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin
const initializeFirebaseAdmin = () => {
  if (getApps().length === 0) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      initializeApp({
        projectId: "nifemii-abe-689cd",
      });
    }
  }
  return getFirestore();
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      console.error("PAYSTACK_SECRET_KEY not configured");
      return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }

    // Verify webhook signature
    const hash = crypto
      .createHmac("sha512", secretKey)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle charge.success event
    if (event.event === "charge.success") {
      const transaction = event.data;
      const orderId = transaction.metadata?.orderId;

      if (orderId) {
        try {
          const db = initializeFirebaseAdmin();

          // Update order with payment info
          await db.collection("orders").doc(orderId).update({
            paymentStatus: "paid",
            paymentReference: transaction.reference,
            paymentMethod: "online",
            paymentChannel: transaction.channel,
            paidAt: new Date(transaction.paid_at),
            "pricing.paidAmount": transaction.amount / 100,
            status: "confirmed", // Auto-confirm paid orders
            updatedAt: new Date(),
          });

          console.log(`Order ${orderId} marked as paid`);
        } catch (dbError) {
          console.error("Error updating order:", dbError);
          // Still return 200 to Paystack to prevent retries
        }
      }
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    // Return 200 even on error to prevent Paystack from retrying
    return NextResponse.json({ received: true });
  }
}
