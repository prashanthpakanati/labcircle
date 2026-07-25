// apps/web/lib/fulfillment/utils/CollectionVerificationEngine.ts

import { VerificationStatus } from "../models/enums";
import { CollectionVerification } from "../models/types";

/**
 * CollectionVerificationEngine
 * ----------------------------
 * Handles OTP generation, SHA-256 hashing, verification, 15-minute expiration,
 * attempt counting (max 3), and lockouts.
 * Plaintext OTPs are NEVER stored.
 */
export class CollectionVerificationEngine {
  private static readonly OTP_TTL_MS = 15 * 60 * 1000; // 15 minutes
  private static readonly MAX_ATTEMPTS = 3;

  /**
   * Simple SHA-256 hashing string helper.
   */
  static async hashOtp(otp: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(otp.trim());
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  /**
   * Generates a 4-digit random numeric OTP string.
   */
  static generatePlaintextOtp(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  /**
   * Computes expiry timestamp 15 minutes from now.
   */
  static computeExpiryTimestamp(): Date {
    return new Date(Date.now() + this.OTP_TTL_MS);
  }

  /**
   * Verifies an attempted plaintext OTP against a CollectionVerification record.
   * Enforces expiry and attempt limit checks.
   */
  static async verifyAttempt(
    verification: CollectionVerification,
    attemptPlaintextOtp: string
  ): Promise<{ success: boolean; updatedVerification: Partial<CollectionVerification>; reason?: string }> {
    if (verification.status === VerificationStatus.VERIFIED) {
      return { success: true, updatedVerification: {}, reason: "Already verified" };
    }

    if (verification.status === VerificationStatus.EXPIRED || verification.expiresAt.toMillis() < Date.now()) {
      return {
        success: false,
        updatedVerification: { status: VerificationStatus.EXPIRED },
        reason: "OTP has expired. Please regenerate.",
      };
    }

    if (verification.attemptCount >= this.MAX_ATTEMPTS || verification.status === VerificationStatus.FAILED) {
      return {
        success: false,
        updatedVerification: { status: VerificationStatus.FAILED },
        reason: "Maximum verification attempts exceeded. Verification locked.",
      };
    }

    const hashedAttempt = await this.hashOtp(attemptPlaintextOtp);
    const newAttemptCount = verification.attemptCount + 1;

    if (hashedAttempt === verification.otpHash) {
      return {
        success: true,
        updatedVerification: {
          status: VerificationStatus.VERIFIED,
          attemptCount: newAttemptCount,
        },
      };
    }

    const isLockedOut = newAttemptCount >= this.MAX_ATTEMPTS;
    return {
      success: false,
      updatedVerification: {
        attemptCount: newAttemptCount,
        status: isLockedOut ? VerificationStatus.FAILED : VerificationStatus.PENDING,
      },
      reason: isLockedOut
        ? "Invalid OTP. Maximum attempts reached. Locked."
        : `Invalid OTP. ${this.MAX_ATTEMPTS - newAttemptCount} attempts remaining.`,
    };
  }
}
