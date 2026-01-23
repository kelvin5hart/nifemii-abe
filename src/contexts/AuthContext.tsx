"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  signInAnonymously,
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
import { auth, db } from "@/lib/firebase";
import { User } from "@/lib/firebase-types";
import {
  sendOTP as sendOTPService,
  verifyOTP as verifyOTPService,
  formatPhoneNumber,
} from "@/lib/otp-service";

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;

  // Phone auth (custom OTP)
  sendOTP: (phoneNumber: string) => Promise<{ success: boolean; message: string; testCode?: string }>;
  verifyOTPAndSignIn: (phoneNumber: string, otp: string) => Promise<{ success: boolean; message: string }>;

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ id: userDoc.id, ...userDoc.data() } as User);
        } else {
          // User exists in Firebase Auth but not in Firestore
          // This can happen with anonymous users before phone verification
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Send OTP using custom service
  const sendOTP = async (phoneNumber: string) => {
    return await sendOTPService(phoneNumber);
  };

  // Verify OTP and sign in
  const verifyOTPAndSignIn = async (phoneNumber: string, otp: string) => {
    // First verify the OTP
    const verifyResult = await verifyOTPService(phoneNumber, otp);

    if (!verifyResult.success) {
      return verifyResult;
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);

    try {
      // Check if a user with this phone number already exists
      const usersQuery = query(
        collection(db, "users"),
        where("phone", "==", formattedPhone)
      );
      const existingUsers = await getDocs(usersQuery);

      let userId: string;

      if (!existingUsers.empty) {
        // User exists - use their ID
        userId = existingUsers.docs[0].id;

        // Sign in anonymously to get a session (we'll link to the user data)
        const anonResult = await signInAnonymously(auth);

        // If the anonymous user ID doesn't match, we need to handle this
        // For simplicity, we'll just use the existing user data
        if (anonResult.user.uid !== userId) {
          // Update the user doc to link with this auth session
          // Or create a session mapping
        }

        setUser({ id: userId, ...existingUsers.docs[0].data() } as User);
      } else {
        // New user - create account
        const anonResult = await signInAnonymously(auth);
        userId = anonResult.user.uid;

        // Create user document
        await setDoc(doc(db, "users", userId), {
          phone: formattedPhone,
          createdAt: serverTimestamp(),
          createdBy: "self",
        });

        setUser({
          id: userId,
          phone: formattedPhone,
          createdAt: new Date(),
          createdBy: "self",
        });
      }

      return {
        success: true,
        message: "Logged in successfully!",
      };
    } catch (error) {
      console.error("Sign in error:", error);
      return {
        success: false,
        message: "Failed to sign in. Please try again.",
      };
    }
  };

  // Check if a phone number has a password set
  const checkHasPassword = async (phoneNumber: string): Promise<boolean> => {
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
  };

  // Login with phone + password
  const loginWithPassword = async (phoneNumber: string, password: string) => {
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

      // Verify password (simple hash comparison - in production use bcrypt)
      const inputHash = btoa(password + formattedPhone); // Simple hash
      if (inputHash !== userData.passwordHash) {
        return { success: false, message: "Incorrect password" };
      }

      // Sign in anonymously to create a session
      await signInAnonymously(auth);

      // Set the user data
      setUser({ id: userDoc.id, ...userData } as User);

      return { success: true, message: "Logged in successfully!" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Failed to login. Please try again." };
    }
  };

  // Set password for current user
  const setPassword = async (password: string) => {
    if (!user || !user.phone) {
      return { success: false, message: "You must be logged in to set a password" };
    }

    if (password.length < 6) {
      return { success: false, message: "Password must be at least 6 characters" };
    }

    try {
      // Create a simple hash (in production use bcrypt)
      const passwordHash = btoa(password + user.phone);

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
  };

  // Admin login with email/password
  const adminLogin = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);

    // Check if user is admin
    const userDoc = await getDoc(doc(db, "users", result.user.uid));
    if (!userDoc.exists() || !userDoc.data()?.isAdmin) {
      await firebaseSignOut(auth);
      throw new Error("Unauthorized: Not an admin");
    }

    setUser({ id: userDoc.id, ...userDoc.data() } as User);
  };

  // Sign out
  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setFirebaseUser(null);
  };

  const value: AuthContextType = {
    firebaseUser,
    user,
    loading,
    isAdmin: user?.isAdmin || false,
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
