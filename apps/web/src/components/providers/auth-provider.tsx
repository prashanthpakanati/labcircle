"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export interface AuthUser {
  uid: string;
  email: string | null;
  phone: string | null;
  role: "patient" | "phlebotomist" | "lab_technician" | "pathologist" | "admin" | null;
  associationId: string | null;
  firebaseUser: User;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Listen to Firebase Auth state transitions
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          if (firebaseUser) {
            // Retrieve ID token results containing Custom Claims (RBAC roles)
            const tokenResult = await getIdTokenResult(firebaseUser, true);
            const role = (tokenResult.claims.role as AuthUser["role"]) || "patient";
            const associationId = (tokenResult.claims.associationId as string) || null;

            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              phone: firebaseUser.phoneNumber,
              role,
              associationId,
              firebaseUser,
            });
          } else {
            setUser(null);
          }
        } catch (err) {
          console.error("Error retrieving ID token claims for user:", err);
          setError(err instanceof Error ? err : new Error("Failed to process auth transition"));
          setUser(null);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Firebase auth state listener returned an error:", err);
        setError(err);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
