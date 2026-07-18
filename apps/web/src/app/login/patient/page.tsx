"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { sendOtp } from "@/lib/auth/services/auth-service";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { PhoneInput } from "@/components/auth/auth-inputs";
import { LoadingButton } from "@/components/auth/auth-buttons";
import { ErrorBanner } from "@/components/auth/auth-feedback";
import { FormHeader, FormFooter } from "@/components/auth/auth-headers";

export default function PatientLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  useEffect(() => {
    // Initialize invisible Recaptcha Verifier on the client
    if (typeof window !== "undefined" && !recaptchaVerifier) {
      try {
        const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
          callback: () => {
            // ReCAPTCHA solved, direct progress continues
          },
        });
        setRecaptchaVerifier(verifier);
      } catch (err) {
        console.error("Failed to initialize Recaptcha:", err);
        setError("Recaptcha verification initialization failed.");
      }
    }
  }, [recaptchaVerifier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple validation
    if (phone.length !== 10 || !/^[0-9]+$/.test(phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!recaptchaVerifier) {
      setError("Recaptcha verifier is not ready. Please try again.");
      return;
    }

    setIsLoading(true);
    try {
      const formatPhone = `+91${phone}`;
      const confirmation = await sendOtp(formatPhone, recaptchaVerifier);
      
      // Save confirmationResult to global window for OTP verification page to access
      const globalObj = window as unknown as Record<string, unknown>;
      globalObj.confirmationResult = confirmation;

      // Navigate to OTP page passing phone query param
      router.push(`/login/otp?phone=${encodeURIComponent(phone)}`);
    } catch (err) {
      console.error("Error sending OTP phone verification code:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to dispatch verification code. Please check your network or try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <FormHeader
          title="Patient Sign In"
          description="Enter your 10-digit mobile number to receive a secure OTP code."
        />

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <ErrorBanner message={error} />

          <PhoneInput
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isLoading}
          />

          <LoadingButton isLoading={isLoading}>
            Send OTP Code
          </LoadingButton>

          {/* Target div for reCAPTCHA widget */}
          <div id="recaptcha-container" />
        </form>

        <FormFooter
          linkText="Sign In as Staff"
          href="/login/staff"
          prefixText="Accessing diagnostic systems?"
        />
      </AuthCard>
    </AuthLayout>
  );
}
