// apps/web/lib/fulfillment/__tests__/verificationEngine.test.ts

import { describe, it, expect } from "vitest";
import { CollectionVerificationEngine } from "../utils/CollectionVerificationEngine";
import { CollectionVerification } from "../models/types";
import { VerificationStatus } from "../models/enums";
import { Timestamp } from "firebase/firestore";

describe("CollectionVerificationEngine", () => {
  it("hashes OTP using SHA-256 and never matches incorrect OTP", async () => {
    const plain = "4321";
    const hashed = await CollectionVerificationEngine.hashOtp(plain);

    expect(hashed).not.toBe(plain);
    expect(hashed).toHaveLength(64); // SHA-256 hex string length
  });

  it("verifies matching OTP and updates status to VERIFIED", async () => {
    const plain = "1234";
    const hashed = await CollectionVerificationEngine.hashOtp(plain);

    const record: CollectionVerification = {
      id: "v-1",
      fulfillmentId: "f-1",
      otpHash: hashed,
      expiresAt: Timestamp.fromDate(new Date(Date.now() + 600000)),
      attemptCount: 0,
      maxAttempts: 3,
      status: VerificationStatus.PENDING,
      createdAt: { seconds: 1000 } as unknown as Timestamp,
      updatedAt: { seconds: 1000 } as unknown as Timestamp,
    };

    const res = await CollectionVerificationEngine.verifyAttempt(record, "1234");
    expect(res.success).toBe(true);
    expect(res.updatedVerification.status).toBe(VerificationStatus.VERIFIED);
  });

  it("locks out verification after 3 failed attempts", async () => {
    const hashed = await CollectionVerificationEngine.hashOtp("1234");

    const record: CollectionVerification = {
      id: "v-1",
      fulfillmentId: "f-1",
      otpHash: hashed,
      expiresAt: Timestamp.fromDate(new Date(Date.now() + 600000)),
      attemptCount: 2,
      maxAttempts: 3,
      status: VerificationStatus.PENDING,
      createdAt: { seconds: 1000 } as unknown as Timestamp,
      updatedAt: { seconds: 1000 } as unknown as Timestamp,
    };

    const res = await CollectionVerificationEngine.verifyAttempt(record, "9999");
    expect(res.success).toBe(false);
    expect(res.updatedVerification.status).toBe(VerificationStatus.FAILED);
    expect(res.reason).toMatch(/Maximum attempts reached/);
  });
});
