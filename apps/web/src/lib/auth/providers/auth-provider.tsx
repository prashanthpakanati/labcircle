"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import { AuthenticatedUser } from "../types";
import { Role } from "@/lib/permissions/roles";
import { ROLE_PERMISSIONS } from "@/lib/permissions/pbac";

interface AuthContextType {
  user: AuthenticatedUser | null;
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Listen to Firebase Auth state updates
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          if (firebaseUser) {
            // Retrieve ID token results containing Custom Claims (RBAC roles)
            const tokenResult = await getIdTokenResult(firebaseUser, true);
            const token = tokenResult.token;
            
            // Set session token in cookie for Next.js Middleware route checks
            document.cookie = `__session=${token}; path=/; max-age=3600; Secure; SameSite=Lax`;

            const role = (tokenResult.claims.role as Role) || "patient";
            const associationId = (tokenResult.claims.associationId as string) || null;
            const permissions = ROLE_PERMISSIONS[role] || [];

            // 1. Check if user document exists in Firestore (Bootstrap step)
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
              // Bootstrap new user document profile
              await setDoc(userDocRef, {
                uid: firebaseUser.uid,
                role,
                displayName: firebaseUser.displayName || null,
                email: firebaseUser.email || null,
                phoneNumber: firebaseUser.phoneNumber || null,
                status: "active",
                createdAt: serverTimestamp(),
                lastLoginAt: serverTimestamp(),
                schemaVersion: 1,
              });
            } else {
              // Update last login timestamp for existing users
              await updateDoc(userDocRef, {
                lastLoginAt: serverTimestamp(),
              });
            }

            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              phoneNumber: firebaseUser.phoneNumber,
              displayName: firebaseUser.displayName,
              role,
              associationId,
              permissions,
              firebaseUser,
            });
          } else {
            // Clear session token on logout
            document.cookie = `__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
            setUser(null);
          }
        } catch (err) {
          console.error("Authentication provider transition failure:", err);
          setError(err instanceof Error ? err : new Error("Failed to process auth transition"));
          setUser(null);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Firebase Auth state observer failure:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
