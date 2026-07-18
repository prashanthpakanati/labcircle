"use client";

import React from "react";
import { useAuth } from "../hooks";
import { can } from "@/lib/permissions/pbac";
import { Role } from "@/lib/permissions/roles";
import { Permission } from "@/lib/permissions/permissions";
import { Spinner } from "@/components/ui/loading";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface GuardProps {
  children: React.ReactNode;
}

interface RoleGuardProps extends GuardProps {
  allowedRoles: Role[];
}

interface PermissionGuardProps extends GuardProps {
  permission: Permission;
}

/**
 * AuthGuard: Blocks access to routes unless the user is authenticated.
 */
export const AuthGuard = ({ children }: GuardProps) => {
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
          <AlertTitle>Secure Connection Error</AlertTitle>
          <AlertDescription>
            {error.message || "Failed to establish a secure authentication link."}
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
              Authentication Required
            </CardTitle>
            <CardDescription>Secure workspace path</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-500 leading-relaxed">
            Please log in using your credentials or verification keys to view this clinical panel.
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * GuestGuard: Restricts access to public routes (like login pages) for logged-in users.
 */
export const GuestGuard = ({ children }: GuardProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner size="lg" />
      </div>
    );
  }

  // If user is authenticated, we block the login panel display
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <Card className="w-full max-w-md border border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-slate-800 font-bold">Already Signed In</CardTitle>
            <CardDescription>Active user session detected</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-500 leading-relaxed">
            You are currently signed in. Please log out first if you wish to switch accounts.
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * RoleGuard: Blocks access to routes unless the user holds one of the specified roles.
 */
export const RoleGuard = ({ allowedRoles, children }: RoleGuardProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
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
              Unauthorized Access
            </CardTitle>
            <CardDescription>Role restricted area</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-500 leading-relaxed">
            Your current account role does not have the required access permissions to open this clinical workspace.
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * PermissionGuard: Decoupled PBAC Guard checking capabilities rather than roles.
 */
export const PermissionGuard = ({ permission, children }: PermissionGuardProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user || !can(user, permission)) {
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
              Permission Denied
            </CardTitle>
            <CardDescription>Required action: <code className="text-red-600 font-mono text-xs bg-red-50 px-1 py-0.5 rounded">{permission}</code></CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-500 leading-relaxed">
            Your profile does not hold the required authorization claims to perform this action.
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
