import { initializeApp, getApps } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAmJ53W4OJp6xbJ-QHVAaBbJg4EQLdbIh4",
  authDomain: "nifemii-abe-689cd.firebaseapp.com",
  projectId: "nifemii-abe-689cd",
  storageBucket: "nifemii-abe-689cd.firebasestorage.app",
  messagingSenderId: "430817811311",
  appId: "1:430817811311:web:33e9e78812dbc457f9a69a",
  measurementId: "G-SFVS5YF9HY",
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

export default app;
