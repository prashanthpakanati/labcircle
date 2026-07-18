import "server-only";
import * as admin from "firebase-admin";

const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true";

if (admin.apps.length === 0) {
  if (useEmulator) {
    // For local emulator execution, no service account keys are required.
    // The Admin SDK automatically targets the hosts defined in environment variables.
    admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "labcircle-dev",
    });
  } else {
    // Fail-fast environment validation
    if (
      !process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY
    ) {
      throw new Error("Missing critical Firebase Admin SDK credentials in production environment.");
    }

    // Production credential binding using Secure GCP Environment Keys
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }
}

const adminAuth = admin.auth();
const adminDb = admin.firestore();
const adminStorage = admin.storage();

export { adminAuth, adminDb, adminStorage };
export type FirebaseAdminApp = typeof admin;
export type FirestoreAdmin = typeof adminDb;
