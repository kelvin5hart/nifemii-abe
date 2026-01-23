import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// OTP expires after 5 minutes
const OTP_EXPIRY_MINUTES = 5;

// Termii API configuration
const TERMII_API_KEY = "TLezWGrsbuJBBCLYZiUogzZjzofxaIKYqRwsjvenTDZQxuBMfbGexCQoFvQWhM";

interface OTPDocument {
  phone: string;
  code: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  attempts: number;
}

// Generate a 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Format phone number to standard format
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  let digits = phone.replace(/\D/g, "");

  // Handle Nigerian numbers
  if (digits.startsWith("0")) {
    digits = "234" + digits.slice(1);
  } else if (!digits.startsWith("234")) {
    digits = "234" + digits;
  }

  return "+" + digits;
}

// Format phone for Termii (without + sign)
function formatPhoneForTermii(phone: string): string {
  return phone.replace(/\+/g, "");
}

// Create OTP document ID from phone number (safe for Firestore)
function getOTPDocId(phone: string): string {
  return phone.replace(/\+/g, "");
}

// Send SMS via Termii (disabled until Sender ID is approved)
// To enable: Request a Sender ID on Termii dashboard, then update TERMII_SENDER_ID
const TERMII_SENDER_ID = ""; // Set your approved sender ID here

async function sendSMSViaTermii(phone: string, code: string): Promise<boolean> {
  // Skip SMS if no sender ID configured
  if (!TERMII_SENDER_ID) {
    console.log("========================================");
    console.log(`📱 OTP CODE for ${phone}: ${code}`);
    console.log("========================================");
    console.log("(SMS disabled - configure TERMII_SENDER_ID to enable)");
    return true; // Return true so the flow continues
  }

  try {
    const response = await fetch("https://api.ng.termii.com/api/sms/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: TERMII_API_KEY,
        to: formatPhoneForTermii(phone),
        from: TERMII_SENDER_ID,
        sms: `Your Nifemii Abe verification code is: ${code}. Valid for ${OTP_EXPIRY_MINUTES} minutes.`,
        type: "plain",
        channel: "generic",
      }),
    });

    const data = await response.json();
    console.log("Termii response:", JSON.stringify(data, null, 2));

    if (data.message_id || response.status === 200) {
      return true;
    } else {
      console.error("Termii error:", JSON.stringify(data, null, 2));
      // Still log OTP to console as fallback
      console.log(`📱 OTP CODE (SMS failed): ${code}`);
      return true;
    }
  } catch (error) {
    console.error("Error sending SMS via Termii:", error);
    console.log(`📱 OTP CODE (SMS error): ${code}`);
    return true;
  }
}

// Testing mode - set to true to show OTP on screen instead of SMS
// IMPORTANT: Set to false before deploying to production!
export const OTP_TESTING_MODE = true;

// Send OTP
export async function sendOTP(phone: string): Promise<{ success: boolean; message: string; testCode?: string }> {
  try {
    const formattedPhone = formatPhoneNumber(phone);
    const docId = getOTPDocId(formattedPhone);
    const code = generateOTP();

    const now = new Date();
    const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Store OTP in Firestore
    await setDoc(doc(db, "otps", docId), {
      phone: formattedPhone,
      code: code,
      createdAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(expiresAt),
      attempts: 0,
    });

    // Send SMS via Termii
    const smsSent = await sendSMSViaTermii(formattedPhone, code);

    if (!smsSent) {
      // Log for debugging but don't fail - in case Termii has issues
      console.warn("SMS sending may have failed, but OTP is stored");
    }

    return {
      success: true,
      message: `Verification code sent to ${formattedPhone}`,
      // Include code in response for testing mode only
      testCode: OTP_TESTING_MODE ? code : undefined,
    };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return {
      success: false,
      message: "Failed to send OTP. Please try again.",
    };
  }
}

// Verify OTP
export async function verifyOTP(
  phone: string,
  code: string
): Promise<{ success: boolean; message: string }> {
  try {
    const formattedPhone = formatPhoneNumber(phone);
    const docId = getOTPDocId(formattedPhone);

    const otpDoc = await getDoc(doc(db, "otps", docId));

    if (!otpDoc.exists()) {
      return {
        success: false,
        message: "No OTP found. Please request a new code.",
      };
    }

    const otpData = otpDoc.data() as OTPDocument;

    // Check if expired
    const now = new Date();
    const expiresAt = otpData.expiresAt.toDate();
    if (now > expiresAt) {
      await deleteDoc(doc(db, "otps", docId));
      return {
        success: false,
        message: "OTP has expired. Please request a new code.",
      };
    }

    // Check attempts (max 3)
    if (otpData.attempts >= 3) {
      await deleteDoc(doc(db, "otps", docId));
      return {
        success: false,
        message: "Too many attempts. Please request a new code.",
      };
    }

    // Verify code
    if (otpData.code !== code) {
      // Increment attempts
      await setDoc(
        doc(db, "otps", docId),
        { attempts: otpData.attempts + 1 },
        { merge: true }
      );
      return {
        success: false,
        message: `Invalid code. ${2 - otpData.attempts} attempts remaining.`,
      };
    }

    // OTP verified - delete it
    await deleteDoc(doc(db, "otps", docId));

    return {
      success: true,
      message: "OTP verified successfully.",
    };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return {
      success: false,
      message: "Failed to verify OTP. Please try again.",
    };
  }
}
