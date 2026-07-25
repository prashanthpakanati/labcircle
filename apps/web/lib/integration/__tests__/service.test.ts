// apps/web/lib/integration/__tests__/service.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ClientType, IntegrationStatus, APIStatus, SDKLanguage } from "../models/enums";
import { Timestamp } from "firebase/firestore";

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn(() => ({})),
    doc: vi.fn(() => ({ id: "gen-int-id" })),
    setDoc: vi.fn().mockResolvedValue(undefined),
    serverTimestamp: vi.fn(() => Timestamp.now()),
  };
});

const mockAPIRepo = {
  createClient: vi.fn().mockResolvedValue(undefined),
  createKey: vi.fn().mockResolvedValue(undefined),
  getKeyByHash: vi.fn().mockResolvedValue(null),
};

const mockWebhookRepo = {
  createSubscription: vi.fn().mockResolvedValue(undefined),
  recordDelivery: vi.fn().mockResolvedValue(undefined),
  getSubscriptionsForEvent: vi.fn().mockResolvedValue([]),
};

const mockAuditRepo = {
  logAction: vi.fn().mockResolvedValue(undefined),
  search: vi.fn().mockResolvedValue({ auditLogs: [], nextCursor: undefined }),
};

vi.mock("../repositories/APIRepository", () => ({
  APIRepository: vi.fn(function () {
    return mockAPIRepo;
  }),
}));

vi.mock("../repositories/WebhookRepository", () => ({
  WebhookRepository: vi.fn(function () {
    return mockWebhookRepo;
  }),
}));

vi.mock("../repositories/IntegrationAuditRepository", () => ({
  IntegrationAuditRepository: vi.fn(function () {
    return mockAuditRepo;
  }),
}));

const { IntegrationService } = await import("../services/IntegrationService");

describe("IntegrationService Gateway & Developer Platform", () => {
  let service: InstanceType<typeof IntegrationService>;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new IntegrationService();
  });

  it("creates API client and secret key, logging immutable audit record", async () => {
    const res = await service.createAPIClient({
      clientName: "Partner Hospital HIS",
      clientType: ClientType.HOSPITAL_HIS,
      developerId: "dev-100",
      scopes: ["booking:read", "reports:read"],
    });

    expect(res.client.status).toBe(IntegrationStatus.ACTIVE);
    expect(res.rawSecretKey).toMatch(/^lc_live_/);
    expect(mockAPIRepo.createClient).toHaveBeenCalledTimes(1);
    expect(mockAPIRepo.createKey).toHaveBeenCalledTimes(1);
    expect(mockAuditRepo.logAction).toHaveBeenCalledTimes(1);
  });

  it("registers webhook subscription and assigns HMAC secret key", async () => {
    const sub = await service.registerWebhook({
      developerId: "dev-100",
      targetUrl: "https://partner.com/api/webhooks",
      events: ["BookingConfirmed", "ReportReady"],
    });

    expect(sub.status).toBe(APIStatus.ACTIVE);
    expect(sub.secretKey).toMatch(/^whsec_/);
    expect(mockWebhookRepo.createSubscription).toHaveBeenCalledTimes(1);
  });

  it("generates SDK release package for Kotlin", () => {
    const sdk = service.generateSDK({
      language: SDKLanguage.KOTLIN,
      version: "2.1.0",
    });

    expect(sdk.language).toBe(SDKLanguage.KOTLIN);
    expect(sdk.downloadUrl).toContain("kotlin-v2.1.0.zip");
  });
});
