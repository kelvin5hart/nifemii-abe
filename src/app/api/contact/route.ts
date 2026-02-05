import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { z } from "zod";

// Input validation schema
const contactFormSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters"),
  email: z.string()
    .email("Invalid email address")
    .max(254, "Email is too long"),
  phone: z.string()
    .regex(/^[+]?[\d\s()-]{7,20}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  service: z.string()
    .min(1, "Service is required")
    .max(100, "Service name is too long"),
  message: z.string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message is too long"),
});

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // 5 requests per hour per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

// HTML escape function to prevent XSS
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
    "`": "&#x60;",
    "=": "&#x3D;",
  };
  return text.replace(/[&<>"'`=/]/g, (char) => htmlEntities[char] || char);
}

// Initialize Firebase Admin for server-side operations
const initializeFirebaseAdmin = () => {
  if (getApps().length === 0) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "nifemii-abe",
      });
    }
  }
  return getFirestore();
};

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
               request.headers.get("x-real-ip") ||
               "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Check origin header for basic CSRF protection
    const origin = request.headers.get("origin");
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_URL,
      "https://nifemii-abe.web.app",
      "https://nifemii-abe.firebaseapp.com",
      "http://localhost:3000",
    ].filter(Boolean);

    if (origin && !allowedOrigins.includes(origin)) {
      return NextResponse.json(
        { error: "Invalid request origin" },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((e) => e.message).join(", ");
      return NextResponse.json(
        { error: `Validation failed: ${errors}` },
        { status: 400 }
      );
    }

    const { name, email, phone, service, message } = validationResult.data;

    // Sanitize all inputs for HTML
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = phone ? escapeHtml(phone) : "";
    const safeService = escapeHtml(service);
    const safeMessage = escapeHtml(message);

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email to business owner (with sanitized inputs)
    const businessEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #f5f5f5; padding: 30px;">
        <div style="text-align: center; border-bottom: 1px solid #2a2a2a; padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="color: #c9a962; font-size: 24px; margin: 0;">New Consultation Request</h1>
        </div>

        <div style="background-color: #111111; border: 1px solid #2a2a2a; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #c9a962; font-size: 16px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">Contact Details</h2>
          <p style="margin: 8px 0;"><strong style="color: #888888;">Name:</strong> ${safeName}</p>
          <p style="margin: 8px 0;"><strong style="color: #888888;">Email:</strong> <a href="mailto:${safeEmail}" style="color: #c9a962;">${safeEmail}</a></p>
          ${safePhone ? `<p style="margin: 8px 0;"><strong style="color: #888888;">Phone:</strong> <a href="tel:${safePhone}" style="color: #c9a962;">${safePhone}</a></p>` : ""}
          <p style="margin: 8px 0;"><strong style="color: #888888;">Service Interest:</strong> ${safeService}</p>
        </div>

        <div style="background-color: #111111; border: 1px solid #2a2a2a; padding: 20px;">
          <h2 style="color: #c9a962; font-size: 16px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">Message</h2>
          <p style="line-height: 1.6; white-space: pre-wrap;">${safeMessage}</p>
        </div>

        <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #2a2a2a;">
          <p style="color: #888888; font-size: 12px;">Received on ${new Date().toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
        </div>
      </div>
    `;

    // Confirmation email to customer
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #f5f5f5; padding: 30px;">
        <div style="text-align: center; border-bottom: 1px solid #2a2a2a; padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="color: #c9a962; font-size: 28px; margin: 0; font-weight: 300;">NIFEMII ABE</h1>
          <p style="color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px;">Bespoke Fashion</p>
        </div>

        <div style="margin-bottom: 20px;">
          <p style="color: #f5f5f5; font-size: 16px;">Dear ${safeName},</p>
          <p style="color: #888888; line-height: 1.8;">Thank you for reaching out to Nifemii Abe. We have received your consultation request and are excited about the possibility of creating something beautiful for you.</p>
          <p style="color: #888888; line-height: 1.8;">Our team will review your message and get back to you within 24 hours.</p>
        </div>

        <div style="background-color: #111111; border: 1px solid #2a2a2a; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #c9a962; font-size: 14px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">Your Request Summary</h2>
          <p style="margin: 8px 0; color: #888888;"><strong>Service:</strong> ${safeService}</p>
          <p style="margin: 8px 0; color: #888888;"><strong>Message:</strong></p>
          <p style="color: #f5f5f5; line-height: 1.6; white-space: pre-wrap; font-style: italic;">"${safeMessage}"</p>
        </div>

        <div style="text-align: center; margin-bottom: 20px;">
          <p style="color: #888888; font-size: 14px;">In the meantime, follow us on social media for inspiration:</p>
          <p style="margin-top: 10px;">
            <a href="https://instagram.com/nifemiiabe" style="color: #c9a962; text-decoration: none; margin: 0 10px;">Instagram</a>
            <span style="color: #2a2a2a;">|</span>
            <a href="https://wa.me/2347067601656" style="color: #c9a962; text-decoration: none; margin: 0 10px;">WhatsApp</a>
          </p>
        </div>

        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #2a2a2a;">
          <p style="color: #888888; font-size: 12px; margin: 0;">Nifemii Abe | Lagos, Nigeria</p>
          <p style="color: #888888; font-size: 12px; margin: 5px 0;">+234 706 760 1656 | nifemiiabe@gmail.com</p>
        </div>
      </div>
    `;

    // Send emails with error handling
    try {
      await transporter.sendMail({
        from: `"Nifemii Abe Website" <${process.env.EMAIL_USER}>`,
        to: "nifemiiabe@gmail.com",
        replyTo: email,
        subject: `New Consultation Request: ${safeService} - ${safeName}`,
        html: businessEmailHtml,
      });
    } catch (emailError) {
      console.error("Failed to send business email:", emailError);
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 500 }
      );
    }

    // Send confirmation to customer (don't fail if this fails)
    try {
      await transporter.sendMail({
        from: `"Nifemii Abe" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Thank You for Contacting Nifemii Abe",
        html: customerEmailHtml,
      });
    } catch (customerEmailError) {
      console.warn("Failed to send customer confirmation:", customerEmailError);
    }

    // Save to Firestore for record-keeping
    try {
      const adminDb = initializeFirebaseAdmin();
      await adminDb.collection("contactMessages").add({
        name: safeName,
        email: safeEmail,
        phone: safePhone || null,
        service: safeService,
        message: safeMessage,
        status: "new",
        createdAt: new Date(),
        ip: ip !== "unknown" ? ip : null,
      });
    } catch (firestoreError) {
      console.warn("Could not save to Firestore:", firestoreError);
    }

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
