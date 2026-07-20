import { getApps, initializeApp, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const clientCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "mock-api-key-for-builds",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mock-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mock-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mock-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456",
};

// Singleton Guard Initialization
const app = getApps().length === 0 ? initializeApp(clientCredentials) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Emulator Detection & Binding
const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true";

if (useEmulator && typeof window !== "undefined") {
  // Prevent double emulator binding during Next.js Hot Module Replacement (HMR)
  const emulatorKey = "_firebase_emulators_connected";
  const globalObj = window as unknown as Record<string, boolean>;

  if (!globalObj[emulatorKey]) {
    try {
      connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
      connectFirestoreEmulator(db, "127.0.0.1", 8080);
      connectStorageEmulator(storage, "127.0.0.1", 9199);
      globalObj[emulatorKey] = true;
        // Firebase Emulators bound successfully on Client SDK.
    } catch (error) {
      console.warn("Failed to bind Firebase Emulators on Client SDK:", error);
    }
  }
}

export { app, auth, db, storage };
export type FirebaseClientApp = typeof app;
