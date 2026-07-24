// apps/web/lib/providerOfferings/__tests__/service.test.ts

/**
 * Unit tests for ProviderOfferingService.
 * Firestore and the Repository are mocked so no network calls are made.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProviderOfferingStatus } from "../models/enums";
import type { ProviderOffering } from "../models/types";
import type { ProviderOfferingFormData } from "../models/form";
import type { OfferingParentSnapshot } from "../services/ProviderOfferingService";
import { Timestamp } from "firebase/firestore";

// ── Firestore mock (must come before imports that use firebase) ───────────────

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn(() => ({})),
    doc: vi.fn(() => ({ id: "generated-id" })),
    serverTimestamp: vi.fn(() => Timestamp.now()),
  };
});

// ── Shared mock repo instance that tests can interrogate ─────────────────────

const mockRepo = {
  create: vi.fn().mockResolvedValue(undefined),
  getById: vi.fn().mockResolvedValue(null),
  update: vi.fn().mockResolvedValue(undefined),
  softDelete: vi.fn().mockResolvedValue(undefined),
  existsDuplicate: vi.fn().mockResolvedValue(false),
  search: vi.fn().mockResolvedValue({ offerings: [], nextCursor: undefined }),
};

vi.mock("../repositories/ProviderOfferingRepository", () => ({
  ProviderOfferingRepository: vi.fn(function () {
    return mockRepo;
  }),
}));

// Import service AFTER mocks are set up
const { ProviderOfferingService } = await import("../services/ProviderOfferingService");

// ── Helpers ────────────────────────────────────────────────────────────────────

function makeFormData(overrides: Partial<ProviderOfferingFormData> = {}): ProviderOfferingFormData {
  return {
    priceConfiguration: { mrp: 1000, sellingPrice: 800 },
    availability: { enabled: true, onlineBookable: false },
    displayOrder: 0,
    status: ProviderOfferingStatus.Draft,
    ...overrides,
  };
}

function makeSnapshot(): OfferingParentSnapshot {
  return {
    providerBrandName: "Apollo Diagnostics",
    providerName: "Apollo Hospitals Ltd",
    providerCode: "APOLLO",
    serviceName: "MRI Brain",
    serviceCode: "MRI-BRAIN-001",
    categoryId: "imaging",
  };
}

function makeExisting(overrides: Partial<ProviderOffering> = {}): ProviderOffering {
  const now = Timestamp.now();
  return {
    id: "offer-1",
    providerLocationId: "loc-1",
    diagnosticServiceId: "svc-1",
    priceConfiguration: { mrp: 1000, sellingPrice: 800 },
    status: ProviderOfferingStatus.Draft,
    availability: { enabled: true, onlineBookable: false },
    displayOrder: 0,
    providerBrandName: "Apollo Diagnostics",
    searchKeywords: ["mri", "brain", "apollo"],
    lastPriceUpdatedAt: now,
    createdBy: "user-1",
    updatedBy: "user-1",
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    deletedBy: null,
    ...overrides,
  };
}

// ── createOffering ────────────────────────────────────────────────────────────

describe("ProviderOfferingService – createOffering", () => {
  let service: InstanceType<typeof ProviderOfferingService>;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ProviderOfferingService();
  });

  it("rejects empty providerLocationId", async () => {
    await expect(
      service.createOffering("", "svc-1", makeFormData(), makeSnapshot(), "user-1")
    ).rejects.toThrow("providerLocationId is required");
  });

  it("rejects empty diagnosticServiceId", async () => {
    await expect(
      service.createOffering("loc-1", "", makeFormData(), makeSnapshot(), "user-1")
    ).rejects.toThrow("diagnosticServiceId is required");
  });

  it("rejects invalid pricing (sellingPrice > mrp)", async () => {
    await expect(
      service.createOffering(
        "loc-1", "svc-1",
        makeFormData({ priceConfiguration: { mrp: 1000, sellingPrice: 2000 } }),
        makeSnapshot(), "user-1"
      )
    ).rejects.toThrow("validation failed");
  });

  it("rejects when a duplicate active offering exists", async () => {
    mockRepo.existsDuplicate.mockResolvedValueOnce(true);
    await expect(
      service.createOffering("loc-1", "svc-1", makeFormData(), makeSnapshot(), "user-1")
    ).rejects.toThrow("active offering already exists");
  });

  it("always creates with Draft status, ignoring form status", async () => {
    const result = await service.createOffering(
      "loc-1", "svc-1",
      makeFormData({ status: ProviderOfferingStatus.Published }),
      makeSnapshot(), "user-1"
    );
    expect(result.status).toBe(ProviderOfferingStatus.Draft);
  });

  it("auto-generates searchKeywords (never empty)", async () => {
    const result = await service.createOffering("loc-1", "svc-1", makeFormData(), makeSnapshot(), "user-1");
    expect(result.searchKeywords.length).toBeGreaterThan(0);
    expect(result.searchKeywords).toContain("apollo");
    expect(result.searchKeywords).toContain("mri");
  });

  it("sets providerBrandName from snapshot", async () => {
    const result = await service.createOffering("loc-1", "svc-1", makeFormData(), makeSnapshot(), "user-1");
    expect(result.providerBrandName).toBe("Apollo Diagnostics");
  });

  it("calls repo.create exactly once on success", async () => {
    await service.createOffering("loc-1", "svc-1", makeFormData(), makeSnapshot(), "user-1");
    expect(mockRepo.create).toHaveBeenCalledTimes(1);
  });
});

// ── transitionStatus ──────────────────────────────────────────────────────────

describe("ProviderOfferingService – transitionStatus", () => {
  let service: InstanceType<typeof ProviderOfferingService>;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ProviderOfferingService();
  });

  it("denies transition for Viewer role", async () => {
    await expect(
      service.transitionStatus("offer-1", ProviderOfferingStatus.Published, "user-1", "Viewer")
    ).rejects.toThrow("Permission denied");
  });

  it("rejects invalid transition: Draft → Archived", async () => {
    mockRepo.getById.mockResolvedValueOnce(makeExisting({ status: ProviderOfferingStatus.Draft }));
    await expect(
      service.transitionStatus("offer-1", ProviderOfferingStatus.Archived, "user-1", "Admin")
    ).rejects.toThrow("Invalid status transition");
  });

  it("allows Draft → Published for Admin", async () => {
    mockRepo.getById.mockResolvedValueOnce(makeExisting({ status: ProviderOfferingStatus.Draft }));
    await expect(
      service.transitionStatus("offer-1", ProviderOfferingStatus.Published, "user-1", "Admin")
    ).resolves.not.toThrow();
    expect(mockRepo.update).toHaveBeenCalledTimes(1);
  });

  it("allows Published → Archived for Editor", async () => {
    mockRepo.getById.mockResolvedValueOnce(makeExisting({ status: ProviderOfferingStatus.Published }));
    await expect(
      service.transitionStatus("offer-1", ProviderOfferingStatus.Archived, "user-1", "Editor")
    ).resolves.not.toThrow();
  });

  it("allows Archived → Draft (restore)", async () => {
    mockRepo.getById.mockResolvedValueOnce(makeExisting({ status: ProviderOfferingStatus.Archived }));
    await expect(
      service.transitionStatus("offer-1", ProviderOfferingStatus.Draft, "user-1", "SuperAdmin")
    ).resolves.not.toThrow();
  });
});

// ── deleteOffering ────────────────────────────────────────────────────────────

describe("ProviderOfferingService – deleteOffering (soft delete)", () => {
  let service: InstanceType<typeof ProviderOfferingService>;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ProviderOfferingService();
  });

  it("denies soft delete for Editor role", async () => {
    await expect(
      service.deleteOffering("offer-1", "user-1", "Editor")
    ).rejects.toThrow("Permission denied");
  });

  it("denies soft delete for Viewer role", async () => {
    await expect(
      service.deleteOffering("offer-1", "user-1", "Viewer")
    ).rejects.toThrow("Permission denied");
  });

  it("allows soft delete for SuperAdmin", async () => {
    mockRepo.getById.mockResolvedValueOnce(makeExisting());
    await expect(
      service.deleteOffering("offer-1", "user-1", "SuperAdmin")
    ).resolves.not.toThrow();
    expect(mockRepo.softDelete).toHaveBeenCalledWith("offer-1", "user-1");
  });

  it("allows soft delete for Admin", async () => {
    mockRepo.getById.mockResolvedValueOnce(makeExisting());
    await expect(
      service.deleteOffering("offer-1", "user-1", "Admin")
    ).resolves.not.toThrow();
  });

  it("throws when offering is not found", async () => {
    mockRepo.getById.mockResolvedValueOnce(null);
    await expect(
      service.deleteOffering("missing", "user-1", "SuperAdmin")
    ).rejects.toThrow("not found");
  });
});

// ── updateOffering – lastPriceUpdatedAt ────────────────────────────────────────

describe("ProviderOfferingService – updateOffering (lastPriceUpdatedAt)", () => {
  let service: InstanceType<typeof ProviderOfferingService>;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ProviderOfferingService();
  });

  it("does NOT change lastPriceUpdatedAt when price is unchanged", async () => {
    const existing = makeExisting();
    mockRepo.getById.mockResolvedValueOnce(existing);

    await service.updateOffering(
      "offer-1",
      { priceConfiguration: { mrp: 1000, sellingPrice: 800 } }, // identical
      makeSnapshot(),
      "user-1"
    );

    const saved: ProviderOffering = mockRepo.update.mock.calls[0][0];
    // lastPriceUpdatedAt should be the original timestamp, unchanged
    expect(saved.lastPriceUpdatedAt.seconds).toBe(existing.lastPriceUpdatedAt.seconds);
  });

  it("updates lastPriceUpdatedAt when sellingPrice changes", async () => {
    const existing = makeExisting();
    mockRepo.getById.mockResolvedValueOnce(existing);

    await service.updateOffering(
      "offer-1",
      { priceConfiguration: { mrp: 1000, sellingPrice: 700 } }, // different sellingPrice
      makeSnapshot(),
      "user-1"
    );

    const saved: ProviderOffering = mockRepo.update.mock.calls[0][0];
    // lastPriceUpdatedAt should be defined and truthy (a fresh serverTimestamp)
    expect(saved.lastPriceUpdatedAt).toBeDefined();
    expect(saved.lastPriceUpdatedAt).not.toBeNull();
  });
});
