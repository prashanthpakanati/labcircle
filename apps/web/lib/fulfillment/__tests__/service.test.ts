// apps/web/lib/fulfillment/__tests__/service.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest";
import { FulfillmentStatus, FulfillmentPriority, SpecimenType, ContainerType, AllocationStrategyType, AssignmentStrategyType, PartnerType } from "../models/enums";
import { ProcessingPartner } from "../models/types";
import { Timestamp } from "firebase/firestore";

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn(() => ({})),
    doc: vi.fn(() => ({ id: "gen-doc-id" })),
    serverTimestamp: vi.fn(() => Timestamp.now()),
  };
});

const mockFulfillmentRepo = {
  create: vi.fn().mockResolvedValue(undefined),
  getById: vi.fn().mockResolvedValue({
    id: "ful-100",
    version: 1,
    bookingId: "b-1",
    serviceCategory: "LAB_TEST",
    fulfillmentStatus: FulfillmentStatus.FULFILLMENT_CREATED,
    priority: FulfillmentPriority.STANDARD,
    pincode: "500001",
    createdAt: { seconds: 1000 },
    updatedAt: { seconds: 1000 },
  }),
  update: vi.fn().mockResolvedValue(undefined),
  softDelete: vi.fn().mockResolvedValue(undefined),
  search: vi.fn().mockResolvedValue({ fulfillments: [], nextCursor: undefined }),
};

const mockVerificationRepo = {
  create: vi.fn().mockResolvedValue(undefined),
  getByFulfillmentId: vi.fn().mockResolvedValue({
    id: "v-1",
    fulfillmentId: "ful-100",
    otpHash: "mocked-hash",
    expiresAt: { toMillis: () => Date.now() + 600000 },
    attemptCount: 0,
    maxAttempts: 3,
    status: "PENDING",
  }),
  update: vi.fn().mockResolvedValue(undefined),
};

const mockTimelineRepo = {
  addEvent: vi.fn().mockResolvedValue(undefined),
  getByFulfillmentId: vi.fn().mockResolvedValue([]),
};

const mockSampleRepo = {
  create: vi.fn().mockResolvedValue(undefined),
  getByFulfillmentId: vi.fn().mockResolvedValue([]),
};

const mockLocationRepo = {
  updateLocation: vi.fn().mockResolvedValue(undefined),
};

vi.mock("../repositories/FulfillmentRepository", () => ({
  FulfillmentRepository: vi.fn(function () {
    return mockFulfillmentRepo;
  }),
}));

vi.mock("../repositories/CollectionVerificationRepository", () => ({
  CollectionVerificationRepository: vi.fn(function () {
    return mockVerificationRepo;
  }),
}));

vi.mock("../repositories/FulfillmentTimelineRepository", () => ({
  FulfillmentTimelineRepository: vi.fn(function () {
    return mockTimelineRepo;
  }),
}));

vi.mock("../repositories/SampleRepository", () => ({
  SampleRepository: vi.fn(function () {
    return mockSampleRepo;
  }),
}));

vi.mock("../repositories/TechnicianLocationRepository", () => ({
  TechnicianLocationRepository: vi.fn(function () {
    return mockLocationRepo;
  }),
}));

const { FulfillmentService } = await import("../services/FulfillmentService");

describe("FulfillmentService", () => {
  let service: InstanceType<typeof FulfillmentService>;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new FulfillmentService();
  });

  it("creates fulfillment record and generates plaintext OTP + SHA-256 hash record", async () => {
    const res = await service.createFulfillment(
      { bookingId: "b-1", serviceCategory: "LAB_TEST", priority: FulfillmentPriority.EXPRESS, pincode: "500001" },
      "user-1",
      "Admin"
    );

    expect(res.fulfillment.fulfillmentStatus).toBe(FulfillmentStatus.FULFILLMENT_CREATED);
    expect(res.plaintextOtp).toHaveLength(4);
    expect(mockFulfillmentRepo.create).toHaveBeenCalledTimes(1);
    expect(mockVerificationRepo.create).toHaveBeenCalledTimes(1);
    expect(mockTimelineRepo.addEvent).toHaveBeenCalledTimes(1);
  });

  it("assigns phlebotomist technician using specified strategy", async () => {
    await service.assignTechnician(
      "ful-100",
      [{ technicianId: "phleb-1", name: "John", pincodes: ["500001"], activeBookingsCount: 0, isActive: true }],
      AssignmentStrategyType.NEAREST,
      "user-1",
      "Admin"
    );

    expect(mockFulfillmentRepo.update).toHaveBeenCalledTimes(1);
    const updated = mockFulfillmentRepo.update.mock.calls[0][0];
    expect(updated.assignedTechnicianId).toBe("phleb-1");
    expect(updated.fulfillmentStatus).toBe(FulfillmentStatus.TECHNICIAN_ASSIGNED);
  });

  it("adds first-class specimen sample tube record", async () => {
    const sample = await service.addSample(
      { fulfillmentId: "ful-100", barcode: "LAB-TUBE-001", specimenType: SpecimenType.BLOOD, containerType: ContainerType.EDTA_TUBE },
      "user-1",
      "Technician"
    );

    expect(sample.barcode).toBe("LAB-TUBE-001");
    expect(sample.specimenType).toBe(SpecimenType.BLOOD);
    expect(mockSampleRepo.create).toHaveBeenCalledTimes(1);
  });

  it("allocates processing partner laboratory using PartnerAllocationEngine", async () => {
    const partners: ProcessingPartner[] = [
      {
        id: "lab-100",
        name: "Partner Lab Central",
        code: "PLC",
        partnerType: PartnerType.LABORATORY,
        accreditations: ["NABL"],
        serviceablePincodes: ["500001"],
        dailyCapacity: 100,
        currentLoad: 10,
        avgTurnaroundHours: 12,
        qualityScore: 95,
        isActive: true,
      },
    ];

    const partner = await service.allocateProcessingPartner(
      "ful-100",
      partners,
      AllocationStrategyType.HYBRID,
      "user-1",
      "Admin"
    );

    expect(partner.id).toBe("lab-100");
    expect(mockFulfillmentRepo.update).toHaveBeenCalledTimes(1);
  });

  it("denies mutation actions for Viewer role", async () => {
    await expect(
      service.createFulfillment(
        { bookingId: "b-1", serviceCategory: "LAB_TEST", priority: FulfillmentPriority.STANDARD },
        "user-1",
        "Viewer"
      )
    ).rejects.toThrow("Permission denied");
  });
});
