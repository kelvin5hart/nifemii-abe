import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Set language for phone auth
if (typeof window !== "undefined") {
  auth.languageCode = "en";
}

// RecaptchaVerifier instance (singleton)
let recaptchaVerifier: RecaptchaVerifier | null = null;
let recaptchaWidgetId: number | null = null;

// Initialize invisible reCAPTCHA for phone authentication
export const initRecaptchaVerifier = async (containerId: string = "recaptcha-container"): Promise<RecaptchaVerifier> => {
  if (typeof window === "undefined") {
    throw new Error("RecaptchaVerifier can only be initialized on the client");
  }

  // Clear existing verifier if present
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch (e) {
      console.log("Error clearing recaptcha:", e);
    }
    recaptchaVerifier = null;
    recaptchaWidgetId = null;
  }

  // Check if container exists
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Container element '${containerId}' not found`);
  }

  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: () => {
      // reCAPTCHA solved - will proceed with phone auth
      console.log("reCAPTCHA solved");
    },
    "expired-callback": () => {
      // Reset reCAPTCHA if expired
      console.log("reCAPTCHA expired");
    },
  });

  // Render the reCAPTCHA widget
  try {
    recaptchaWidgetId = await recaptchaVerifier.render();
    console.log("reCAPTCHA rendered with widget ID:", recaptchaWidgetId);
  } catch (error) {
    console.error("Error rendering reCAPTCHA:", error);
    throw error;
  }

  return recaptchaVerifier;
};

// Get existing verifier
export const getRecaptchaVerifier = (): RecaptchaVerifier | null => {
  return recaptchaVerifier;
};

// Clear reCAPTCHA verifier
export const clearRecaptchaVerifier = () => {
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch (e) {
      console.log("Error clearing recaptcha:", e);
    }
    recaptchaVerifier = null;
    recaptchaWidgetId = null;
  }
};

// Send OTP using Firebase Phone Auth
export const sendPhoneOTP = async (
  phoneNumber: string
): Promise<ConfirmationResult> => {
  if (!recaptchaVerifier) {
    throw new Error("reCAPTCHA verifier not initialized. Call initRecaptchaVerifier first.");
  }
  return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
};

export default app;
