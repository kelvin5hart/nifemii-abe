"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  ConfirmationResult,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import bcrypt from "bcryptjs";
import {
  auth,
  db,
  sendPhoneOTP,
  initRecaptchaVerifier,
  clearRecaptchaVerifier,
} from "@/lib/firebase";
import { User } from "@/lib/firebase-types";
import { formatPhoneNumber } from "@/lib/otp-service";

// Session storage key for password-based logins
const PASSWORD_SESSION_KEY = "nifemii_password_session";
const BCRYPT_SALT_ROUNDS = 10;

interface PasswordSession {
  userId: string;
  phone: string;
  expiresAt: number;
}

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;

  // Phone auth (Firebase Phone Auth)
  initializeRecaptcha: (containerId?: string) => Promise<boolean>;
  sendOTP: (phoneNumber: string) => Promise<{ success: boolean; message: string }>;
  verifyOTPAndSignIn: (otp: string) => Promise<{ success: boolean; message: string }>;

  // Password auth for customers
  checkHasPassword: (phoneNumber: string) => Promise<boolean>;
  loginWithPassword: (phoneNumber: string, password: string) => Promise<{ success: boolean; message: string }>;
  setPassword: (password: string) => Promise<{ success: boolean; message: string }>;

  // Admin auth
  adminLogin: (email: string, password: string) => Promise<void>;

  // Sign out
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to get stored session
const getStoredSession = (): PasswordSession | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(PASSWORD_SESSION_KEY);
    if (!stored) return null;
    const session = JSON.parse(stored) as PasswordSession;
    // Check if session expired (7 days)
    if (session.expiresAt < Date.now()) {
      localStorage.removeItem(PASSWORD_SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
};

// Helper to store session
const storeSession = (userId: string, phone: string): void => {
  if (typeof window === "undefined") return;
  const session: PasswordSession = {
    userId,
    phone,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  localStorage.setItem(PASSWORD_SESSION_KEY, JSON.stringify(session));
};

// Helper to clear session
const clearStoredSession = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PASSWORD_SESSION_KEY);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Store confirmation result for OTP verification
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);
  const pendingPhoneRef = useRef<string | null>(null);

  // Restore password session on mount
  useEffect(() => {
    const restorePasswordSession = async () => {
      const session = getStoredSession();
      if (session) {
        try {
          const userDoc = await getDoc(doc(db, "users", session.userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Verify phone matches
            if (userData.phone === session.phone) {
              setUser({ id: userDoc.id, ...userData } as User);
            } else {
              clearStoredSession();
            }
          } else {
            clearStoredSession();
          }
        } catch (error) {
          console.error("Error restoring session:", error);
          clearStoredSession();
        }
      }
    };

    restorePasswordSession();
  }, []);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser && !firebaseUser.isAnonymous) {
        // Real Firebase auth (phone or email) - fetch user data
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            setUser({ id: userDoc.id, ...userDoc.data() } as User);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Initialize reCAPTCHA verifier
  const initializeRecaptcha = useCallback(async (containerId: string = "recaptcha-container"): Promise<boolean> => {
    try {
      await initRecaptchaVerifier(containerId);
      return true;
    } catch (error) {
      console.error("Error initializing reCAPTCHA:", error);
      return false;
    }
  }, []);

  // Send OTP using Firebase Phone Auth
  const sendOTP = useCallback(async (phoneNumber: string): Promise<{ success: boolean; message: string }> => {
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      pendingPhoneRef.current = formattedPhone;

      // Send OTP via Firebase
      const confirmationResult = await sendPhoneOTP(formattedPhone);
      confirmationResultRef.current = confirmationResult;

      return {
        success: true,
        message: `Verification code sent to ${formattedPhone}`,
      };
    } catch (error: unknown) {
      console.error("Error sending OTP:", error);

      // Clear and reinitialize reCAPTCHA on error
      clearRecaptchaVerifier();

      // Handle specific Firebase errors
      const firebaseError = error as { code?: string; message?: string };
      if (firebaseError.code === "auth/invalid-phone-number") {
        return { success: false, message: "Invalid phone number format" };
      } else if (firebaseError.code === "auth/too-many-requests") {
        return { success: false, message: "Too many attempts. Please try again later." };
      } else if (firebaseError.code === "auth/quota-exceeded") {
        return { success: false, message: "SMS quota exceeded. Please try again later." };
      } else if (firebaseError.code === "auth/invalid-app-credential") {
        return { success: false, message: "Authentication configuration error. Please refresh the page and try again." };
      } else if (firebaseError.code === "auth/captcha-check-failed") {
        return { success: false, message: "reCAPTCHA verification failed. Please refresh the page and try again." };
      }

      return {
        success: false,
        message: firebaseError.message || "Failed to send verification code. Please try again.",
      };
    }
  }, []);

  // Verify OTP and sign in
  const verifyOTPAndSignIn = useCallback(async (otp: string): Promise<{ success: boolean; message: string }> => {
    if (!confirmationResultRef.current) {
      return { success: false, message: "Please request a new code first." };
    }

    try {
      // Verify the OTP with Firebase
      const result = await confirmationResultRef.current.confirm(otp);
      const firebaseUser = result.user;
      const formattedPhone = pendingPhoneRef.current || firebaseUser.phoneNumber || "";

      // Check if user document already exists
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

      if (userDoc.exists()) {
        // Existing user - just update the state
        setUser({ id: userDoc.id, ...userDoc.data() } as User);
      } else {
        // New user - create document
        await setDoc(doc(db, "users", firebaseUser.uid), {
          phone: formattedPhone,
          createdAt: serverTimestamp(),
          createdBy: "self",
        });

        setUser({
          id: firebaseUser.uid,
          phone: formattedPhone,
          createdAt: new Date(),
          createdBy: "self",
        });
      }

      // Clear the confirmation result
      confirmationResultRef.current = null;
      pendingPhoneRef.current = null;

      return {
        success: true,
        message: "Logged in successfully!",
      };
    } catch (error: unknown) {
      console.error("OTP verification error:", error);

      const firebaseError = error as { code?: string };
      if (firebaseError.code === "auth/invalid-verification-code") {
        return { success: false, message: "Invalid verification code" };
      } else if (firebaseError.code === "auth/code-expired") {
        confirmationResultRef.current = null;
        return { success: false, message: "Code expired. Please request a new one." };
      }

      return {
        success: false,
        message: "Failed to verify code. Please try again.",
      };
    }
  }, []);

  // Check if a phone number has a password set
  const checkHasPassword = useCallback(async (phoneNumber: string): Promise<boolean> => {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const usersQuery = query(
      collection(db, "users"),
      where("phone", "==", formattedPhone)
    );
    const existingUsers = await getDocs(usersQuery);

    if (existingUsers.empty) {
      return false;
    }

    const userData = existingUsers.docs[0].data();
    return !!userData.hasPassword;
  }, []);

  // Login with phone + password (using bcrypt)
  const loginWithPassword = useCallback(async (phoneNumber: string, password: string) => {
    const formattedPhone = formatPhoneNumber(phoneNumber);

    try {
      // Find user with this phone number
      const usersQuery = query(
        collection(db, "users"),
        where("phone", "==", formattedPhone)
      );
      const existingUsers = await getDocs(usersQuery);

      if (existingUsers.empty) {
        return { success: false, message: "No account found with this phone number" };
      }

      const userDoc = existingUsers.docs[0];
      const userData = userDoc.data();

      // Check if password is set
      if (!userData.hasPassword || !userData.passwordHash) {
        return { success: false, message: "Password not set. Please use OTP to login." };
      }

      // Verify password using bcrypt
      let isValid = false;
      try {
        isValid = await bcrypt.compare(password, userData.passwordHash);
      } catch {
        // If bcrypt fails, it might be an old btoa hash - try to migrate
        const legacyHash = btoa(password + formattedPhone);
        if (legacyHash === userData.passwordHash) {
          isValid = true;
          // Upgrade to bcrypt hash
          const newHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
          await setDoc(doc(db, "users", userDoc.id), { passwordHash: newHash }, { merge: true });
        }
      }

      if (!isValid) {
        return { success: false, message: "Incorrect password" };
      }

      // Store session for persistence
      storeSession(userDoc.id, formattedPhone);

      // Set the user data
      setUser({ id: userDoc.id, ...userData } as User);

      return { success: true, message: "Logged in successfully!" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Failed to login. Please try again." };
    }
  }, []);

  // Set password for current user (using bcrypt)
  const setPassword = useCallback(async (password: string) => {
    if (!user || !user.phone) {
      return { success: false, message: "You must be logged in to set a password" };
    }

    if (password.length < 6) {
      return { success: false, message: "Password must be at least 6 characters" };
    }

    try {
      // Hash password with bcrypt
      const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

      // Update user document
      await setDoc(
        doc(db, "users", user.id),
        {
          hasPassword: true,
          passwordHash: passwordHash,
        },
        { merge: true }
      );

      // Update local user state
      setUser({ ...user, hasPassword: true });

      return { success: true, message: "Password set successfully! You can now login with your password." };
    } catch (error) {
      console.error("Set password error:", error);
      return { success: false, message: "Failed to set password. Please try again." };
    }
  }, [user]);

  // Admin login with email/password
  const adminLogin = useCallback(async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);

    // Check if user is admin
    const userDoc = await getDoc(doc(db, "users", result.user.uid));
    if (!userDoc.exists() || !userDoc.data()?.isAdmin) {
      await firebaseSignOut(auth);
      throw new Error("Unauthorized: Not an admin");
    }

    setUser({ id: userDoc.id, ...userDoc.data() } as User);
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    // Clear password session
    clearStoredSession();

    // Sign out from Firebase
    await firebaseSignOut(auth);

    setUser(null);
    setFirebaseUser(null);
    confirmationResultRef.current = null;
    pendingPhoneRef.current = null;
    clearRecaptchaVerifier();
  }, []);

  const value: AuthContextType = {
    firebaseUser,
    user,
    loading,
    isAdmin: user?.isAdmin || false,
    initializeRecaptcha,
    sendOTP,
    verifyOTPAndSignIn,
    checkHasPassword,
    loginWithPassword,
    setPassword,
    adminLogin,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
