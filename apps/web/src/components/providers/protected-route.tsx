"use client";

import React from "react";
import { useAuth } from "./auth-provider";
import { Spinner } from "@/components/ui/loading";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export interface ProtectedRouteProps {
  allowedRoles?: Array<"patient" | "phlebotomist" | "lab_technician" | "pathologist" | "admin">;
  children: React.ReactNode;
}

export const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { user, loading, error } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <Alert variant="error" className="max-w-md">
          <AlertTitle>Authentication Connection Error</AlertTitle>
          <AlertDescription>
            {error.message || "Failed to establish secure auth connection."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <Card className="w-full max-w-md border border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-red-600 font-bold flex items-center gap-2">
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="10" />
                <rect x="11" y="9" width="2" height="8" rx="1" />
                <circle cx="12" cy="5" r="1" />
              </svg>
              Access Denied
            </CardTitle>
            <CardDescription>Authenticated access is required.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-500 leading-relaxed">
            Please log in using your registered mobile number or credentials to view this workspace.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (allowedRoles && (!user.role || !allowedRoles.includes(user.role))) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <Card className="w-full max-w-md border border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-amber-600 font-bold flex items-center gap-2">
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Unauthorized
            </CardTitle>
            <CardDescription>Elevated permissions required.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-500 leading-relaxed">
            Your current account role (<span className="font-semibold capitalize text-slate-800">{user.role}</span>) 
            does not have the required permissions to access this clinical dashboard.
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
