import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
}

// Initialize Firebase Admin for server-side operations
// Only initialize if not already done
const initializeFirebaseAdmin = () => {
  if (getApps().length === 0) {
    // For development, use application default credentials or service account
    // In production, use environment variables for the service account
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      // Fallback for development - uses default credentials
      initializeApp({
        projectId: "nifemii-abe-689cd",
      });
    }
  }
  return getFirestore();
};

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, phone, service, message } = body;

    // Validate required fields
    if (!name || !email || !service || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create transporter - using Gmail SMTP
    // For production, use environment variables for credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use App Password for Gmail
      },
    });

    // Email to business owner
    const businessEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #f5f5f5; padding: 30px;">
        <div style="text-align: center; border-bottom: 1px solid #2a2a2a; padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="color: #c9a962; font-size: 24px; margin: 0;">New Consultation Request</h1>
        </div>

        <div style="background-color: #111111; border: 1px solid #2a2a2a; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #c9a962; font-size: 16px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">Contact Details</h2>
          <p style="margin: 8px 0;"><strong style="color: #888888;">Name:</strong> ${name}</p>
          <p style="margin: 8px 0;"><strong style="color: #888888;">Email:</strong> <a href="mailto:${email}" style="color: #c9a962;">${email}</a></p>
          ${phone ? `<p style="margin: 8px 0;"><strong style="color: #888888;">Phone:</strong> <a href="tel:${phone}" style="color: #c9a962;">${phone}</a></p>` : ""}
          <p style="margin: 8px 0;"><strong style="color: #888888;">Service Interest:</strong> ${service}</p>
        </div>

        <div style="background-color: #111111; border: 1px solid #2a2a2a; padding: 20px;">
          <h2 style="color: #c9a962; font-size: 16px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">Message</h2>
          <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
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
          <p style="color: #f5f5f5; font-size: 16px;">Dear ${name},</p>
          <p style="color: #888888; line-height: 1.8;">Thank you for reaching out to Nifemii Abe. We have received your consultation request and are excited about the possibility of creating something beautiful for you.</p>
          <p style="color: #888888; line-height: 1.8;">Our team will review your message and get back to you within 24 hours.</p>
        </div>

        <div style="background-color: #111111; border: 1px solid #2a2a2a; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #c9a962; font-size: 14px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">Your Request Summary</h2>
          <p style="margin: 8px 0; color: #888888;"><strong>Service:</strong> ${service}</p>
          <p style="margin: 8px 0; color: #888888;"><strong>Message:</strong></p>
          <p style="color: #f5f5f5; line-height: 1.6; white-space: pre-wrap; font-style: italic;">"${message}"</p>
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

    // Send email to business owner
    await transporter.sendMail({
      from: `"Nifemii Abe Website" <${process.env.EMAIL_USER}>`,
      to: "nifemiiabe@gmail.com",
      replyTo: email,
      subject: `New Consultation Request: ${service} - ${name}`,
      html: businessEmailHtml,
    });

    // Send confirmation email to customer
    await transporter.sendMail({
      from: `"Nifemii Abe" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank You for Contacting Nifemii Abe",
      html: customerEmailHtml,
    });

    // Save to Firestore for record-keeping (optional - if Firebase Admin is configured)
    try {
      const adminDb = initializeFirebaseAdmin();
      await adminDb.collection("contactMessages").add({
        name,
        email,
        phone: phone || null,
        service,
        message,
        status: "new",
        createdAt: new Date(),
      });
    } catch (firestoreError) {
      // Log but don't fail the request if Firestore save fails
      console.warn("Could not save to Firestore:", firestoreError);
    }

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
