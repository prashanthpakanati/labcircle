"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithEmail } from "@/lib/auth/services/auth-service";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { PasswordField } from "@/components/auth/auth-inputs";
import { LoadingButton } from "@/components/auth/auth-buttons";
import { ErrorBanner, SuccessBanner } from "@/components/auth/auth-feedback";
import { FormHeader, FormFooter } from "@/components/auth/auth-headers";
import { Input } from "@/components/ui/input";

export default function StaffLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Simple validations
    if (!email || !password) {
      setError("Please fill in both email and password fields.");
      return;
    }

    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
      setSuccess("Authentication successful! Loading staff portal...");

      // Delayed navigation to home/dashboard
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      console.error("Staff credentials login failure:", err);
      setError("Invalid email credentials or incorrect password. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <FormHeader
          title="Staff Sign In"
          description="Enter clinical credentials to access your administrative dashboard."
        />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <ErrorBanner message={error} />
          <SuccessBanner message={success} />

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              placeholder="name@labcircle.in"
              className="text-slate-900"
            />
          </div>

          <PasswordField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />

          <div className="flex items-center justify-between text-xs font-semibold select-none mt-1">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
              />
              Remember Me
            </label>
            <button
              type="button"
              onClick={() => setError("Password reset workflows are currently restricted. Please contact your system administrator.")}
              className="text-amber-600 hover:text-amber-500 hover:underline transition-all"
            >
              Forgot Password?
            </button>
          </div>

          <LoadingButton isLoading={isLoading} className="mt-2">
            Sign In to Dashboard
          </LoadingButton>
        </form>

        <FormFooter
          linkText="Sign In as Patient"
          href="/login/patient"
          prefixText="Are you a patient?"
        />
      </AuthCard>
    </AuthLayout>
  );
}
