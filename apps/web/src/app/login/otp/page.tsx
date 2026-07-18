"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { OTPInput } from "@/components/auth/auth-inputs";
import { LoadingButton } from "@/components/auth/auth-buttons";
import { ErrorBanner, SuccessBanner } from "@/components/auth/auth-feedback";
import { FormHeader, FormFooter } from "@/components/auth/auth-headers";
import { Spinner } from "@/components/ui/loading";

function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawPhone = searchParams.get("phone") || "";
  const phone = rawPhone ? `+91 ${rawPhone}` : "your mobile number";

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Countdown timer logic
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (otp.length !== 6 || !/^[0-9]+$/.test(otp)) {
      setError("Please enter a valid 6-digit verification code.");
      return;
    }

    // Retrieve confirmationResult from global window
    const globalObj = window as unknown as Record<string, unknown>;
    const confirmationResult = globalObj.confirmationResult as
      | { confirm: (otp: string) => Promise<unknown> }
      | undefined;

    if (!confirmationResult) {
      setError("Authentication session expired. Please return to patient login.");
      return;
    }

    setIsLoading(true);
    try {
      await confirmationResult.confirm(otp);
      setSuccess("Authentication successful! Loading profile dashboard...");
      
      // Clear global reference
      delete globalObj.confirmationResult;

      // Delayed navigation to home/dashboard
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      console.error("Verification code confirmation error:", err);
      setError("Invalid verification code. Please check and try again.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FormHeader
        title="Verify Code"
        description={`We sent a 6-digit code to ${phone}.`}
      />

      <ErrorBanner message={error} />
      <SuccessBanner message={success} />

      <OTPInput value={otp} onChange={setOtp} error={error || undefined} />

      <div className="text-center text-xs text-slate-500 font-semibold select-none">
        {timer > 0 ? (
          <span>Resend verification code in <span className="text-slate-800">{timer}s</span></span>
        ) : (
          <button
            type="button"
            onClick={() => router.push("/login/patient")}
            className="text-amber-600 hover:text-amber-500 font-bold transition-colors"
          >
            Resend OTP Code
          </button>
        )}
      </div>

      <LoadingButton isLoading={isLoading}>
        Verify & Continue
      </LoadingButton>
    </form>
  );
}

export default function OtpPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <Suspense fallback={
          <div className="flex items-center justify-center p-8">
            <Spinner size="md" />
          </div>
        }>
          <OtpForm />
        </Suspense>
        <FormFooter
          linkText="Go Back to Login"
          href="/login/patient"
        />
      </AuthCard>
    </AuthLayout>
  );
}
