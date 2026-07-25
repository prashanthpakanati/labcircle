// apps/web/lib/integration/__tests__/authenticationEngine.test.ts

import { describe, it, expect } from "vitest";
import { AuthenticationEngine } from "../utils/AuthenticationEngine";
import { IntegrationStatus } from "../models/enums";
import { Timestamp } from "firebase/firestore";
import { APIKey } from "../models/types";

describe("AuthenticationEngine API Key Verification", () => {
  const activeKey: APIKey = {
    id: "key-1",
    clientId: "c-100",
    keyPrefix: "lc_live_12",
    keyHash: "HASH-123",
    scopes: ["booking:read", "reports:read"],
    rateLimitPerMin: 600,
    status: IntegrationStatus.ACTIVE,
    createdAt: { seconds: 1000 } as unknown as Timestamp,
  };

  it("verifies valid API key with matching scope", () => {
    const res = AuthenticationEngine.verifyAPIKey(activeKey, "booking:read");
    expect(res.isAuthenticated).toBe(true);
  });

  it("rejects API key missing required scope", () => {
    const res = AuthenticationEngine.verifyAPIKey(activeKey, "payments:write");
    expect(res.isAuthenticated).toBe(false);
    expect(res.reason).toMatch(/lacks required scope/);
  });

  it("rejects revoked or suspended API key", () => {
    const suspendedKey = { ...activeKey, status: IntegrationStatus.SUSPENDED };
    const res = AuthenticationEngine.verifyAPIKey(suspendedKey, "booking:read");
    expect(res.isAuthenticated).toBe(false);
    expect(res.reason).toMatch(/status is SUSPENDED/);
  });
});
