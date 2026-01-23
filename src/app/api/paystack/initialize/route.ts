import { NextRequest, NextResponse } from "next/server";

interface InitializePaymentRequest {
  email: string;
  amount: number; // Amount in Naira
  orderId: string;
  paymentType?: "full" | "deposit" | "balance"; // Type of payment
  callbackUrl?: string; // Custom callback URL
  metadata?: {
    customerName?: string;
    customerPhone?: string;
    orderItems?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: InitializePaymentRequest = await request.json();
    const { email, amount, orderId, paymentType = "full", callbackUrl, metadata } = body;

    // Validate required fields
    if (!email || !amount || !orderId) {
      return NextResponse.json(
        { error: "Missing required fields: email, amount, orderId" },
        { status: 400 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      console.error("PAYSTACK_SECRET_KEY not configured");
      return NextResponse.json(
        { error: "Payment service not configured" },
        { status: 500 }
      );
    }

    // Determine callback URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const finalCallbackUrl = callbackUrl || `${baseUrl}/checkout/verify`;

    // Initialize transaction with Paystack
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // Paystack expects amount in kobo
        reference: `ORDER-${orderId}-${paymentType.toUpperCase()}-${Date.now()}`,
        callback_url: finalCallbackUrl,
        metadata: {
          orderId,
          paymentType,
          custom_fields: [
            {
              display_name: "Order ID",
              variable_name: "order_id",
              value: orderId,
            },
            {
              display_name: "Payment Type",
              variable_name: "payment_type",
              value: paymentType,
            },
            ...(metadata?.customerName
              ? [
                  {
                    display_name: "Customer Name",
                    variable_name: "customer_name",
                    value: metadata.customerName,
                  },
                ]
              : []),
            ...(metadata?.customerPhone
              ? [
                  {
                    display_name: "Phone Number",
                    variable_name: "customer_phone",
                    value: metadata.customerPhone,
                  },
                ]
              : []),
          ],
        },
      }),
    });

    const data = await response.json();

    if (!data.status) {
      console.error("Paystack initialization failed:", data);
      return NextResponse.json(
        { error: data.message || "Failed to initialize payment" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference,
    });
  } catch (error) {
    console.error("Error initializing payment:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment" },
      { status: 500 }
    );
  }
}
