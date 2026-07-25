// apps/web/lib/communication/__tests__/service.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest";
import { CommunicationStatus, ConsentStatus } from "../models/enums";
import { Timestamp } from "firebase/firestore";

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn(() => ({})),
    doc: vi.fn(() => ({ id: "gen-comm-id" })),
    setDoc: vi.fn().mockResolvedValue(undefined),
    serverTimestamp: vi.fn(() => Timestamp.now()),
  };
});

const mockTemplateRepo = {
  create: vi.fn().mockResolvedValue(undefined),
  getByCode: vi.fn().mockResolvedValue(null),
};

const mockPrefRepo = {
  getPreference: vi.fn().mockResolvedValue(null),
  savePreference: vi.fn().mockResolvedValue(undefined),
};

const mockAuditRepo = {
  logAction: vi.fn().mockResolvedValue(undefined),
  searchByRecipient: vi.fn().mockResolvedValue({ auditLogs: [], nextCursor: undefined }),
};

vi.mock("../repositories/TemplateRepository", () => ({
  TemplateRepository: vi.fn(function () {
    return mockTemplateRepo;
  }),
}));

vi.mock("../repositories/PreferenceRepository", () => ({
  PreferenceRepository: vi.fn(function () {
    return mockPrefRepo;
  }),
}));

vi.mock("../repositories/CommunicationAuditRepository", () => ({
  CommunicationAuditRepository: vi.fn(function () {
    return mockAuditRepo;
  }),
}));

const { CommunicationService } = await import("../services/CommunicationService");

describe("CommunicationService Event Bus", () => {
  let service: InstanceType<typeof CommunicationService>;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new CommunicationService();
  });

  it("publishes communication event and dispatches message via provider adapter", async () => {
    const res = await service.publishEvent({
      eventType: "BookingConfirmed",
      sourceDomain: "Booking",
      recipientId: "pat-1",
      recipientPhone: "+919988776655",
      payload: { bookingId: "B-100" },
    });

    expect(res.status).toBe(CommunicationStatus.DELIVERED);
    expect(mockAuditRepo.logAction).toHaveBeenCalledTimes(1);
  });

  it("suppresses communication event when user opted out", async () => {
    mockPrefRepo.getPreference.mockResolvedValueOnce({
      userId: "pat-1",
      smsConsent: ConsentStatus.OPTED_OUT,
      whatsappConsent: ConsentStatus.OPTED_OUT,
      emailConsent: ConsentStatus.OPTED_OUT,
      pushConsent: ConsentStatus.OPTED_OUT,
      updatedAt: Timestamp.now(),
    });

    const res = await service.publishEvent({
      eventType: "PromotionalOffer",
      sourceDomain: "Commerce",
      recipientId: "pat-1",
      recipientPhone: "+919988776655",
      payload: { offer: "20% off" },
    });

    expect(res.status).toBe("SUPPRESSED");
    expect(res.reason).toMatch(/opted out/);
  });

  it("saves user notification preferences", async () => {
    const pref = await service.updatePreferences({
      userId: "pat-1",
      smsConsent: true,
      whatsappConsent: false,
      emailConsent: true,
      pushConsent: true,
    });

    expect(pref.smsConsent).toBe(ConsentStatus.OPTED_IN);
    expect(pref.whatsappConsent).toBe(ConsentStatus.OPTED_OUT);
    expect(mockPrefRepo.savePreference).toHaveBeenCalledTimes(1);
  });
});
