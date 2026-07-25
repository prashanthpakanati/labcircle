// apps/web/lib/operations/__tests__/service.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest";
import { RegionZone, ExceptionSeverity, ExceptionType } from "../models/enums";
import { Timestamp } from "firebase/firestore";

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn(() => ({})),
    doc: vi.fn(() => ({ id: "gen-op-id" })),
    serverTimestamp: vi.fn(() => Timestamp.now()),
  };
});

const mockAuditRepo = {
  logAction: vi.fn().mockResolvedValue(undefined),
  search: vi.fn().mockResolvedValue({ auditLogs: [], nextCursor: undefined }),
};

const mockConfigRepo = {
  getConfig: vi.fn().mockResolvedValue(null),
  saveConfig: vi.fn().mockResolvedValue(undefined),
};

const mockExceptionRepo = {
  create: vi.fn().mockResolvedValue(undefined),
  getById: vi.fn().mockResolvedValue({
    id: "exc-1",
    fulfillmentId: "f-100",
    region: RegionZone.HYDERABAD_CENTRAL,
    type: ExceptionType.NO_SHOW,
    severity: ExceptionSeverity.HIGH,
    status: "OPEN",
    title: "Patient No Show",
    description: "Doorbell unanswered",
  }),
  update: vi.fn().mockResolvedValue(undefined),
  search: vi.fn().mockResolvedValue({ exceptions: [], nextCursor: undefined }),
};

const mockWorkforceRepo = {
  createShift: vi.fn().mockResolvedValue(undefined),
  getShiftsByRegionAndDate: vi.fn().mockResolvedValue([]),
  createProfile: vi.fn().mockResolvedValue(undefined),
  getProfilesByRegion: vi.fn().mockResolvedValue([]),
};

vi.mock("../repositories/OperationsAuditRepository", () => ({
  OperationsAuditRepository: vi.fn(function () {
    return mockAuditRepo;
  }),
}));

vi.mock("../repositories/OperationsConfigRepository", () => ({
  OperationsConfigRepository: vi.fn(function () {
    return mockConfigRepo;
  }),
}));

vi.mock("../repositories/ExceptionRepository", () => ({
  ExceptionRepository: vi.fn(function () {
    return mockExceptionRepo;
  }),
}));

vi.mock("../repositories/WorkforceRepository", () => ({
  WorkforceRepository: vi.fn(function () {
    return mockWorkforceRepo;
  }),
}));

const { OperationsCommandCenterService } = await import("../services/OperationsCommandCenterService");

describe("OperationsCommandCenterService", () => {
  let service: InstanceType<typeof OperationsCommandCenterService>;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new OperationsCommandCenterService();
  });

  it("fetches command center state for region", async () => {
    const state = await service.getCommandCenterState(RegionZone.HYDERABAD_CENTRAL);
    expect(state.region).toBe(RegionZone.HYDERABAD_CENTRAL);
    expect(state.activeFulfillmentsCount).toBe(42);
  });

  it("creates operational exception case and logs audit record", async () => {
    const exc = await service.createExceptionCase(
      {
        fulfillmentId: "f-100",
        region: RegionZone.HYDERABAD_CENTRAL,
        type: ExceptionType.NO_SHOW,
        severity: ExceptionSeverity.HIGH,
        title: "Doorstep No-Show",
        description: "Patient not answering phone or doorbell",
      },
      "user-admin",
      "Admin"
    );

    expect(exc.fulfillmentId).toBe("f-100");
    expect(mockExceptionRepo.create).toHaveBeenCalledTimes(1);
    expect(mockAuditRepo.logAction).toHaveBeenCalledTimes(1);
  });

  it("creates technician shift schedule and logs audit entry", async () => {
    const shift = await service.createShift(
      {
        technicianId: "phleb-1",
        region: RegionZone.HYDERABAD_CENTRAL,
        date: "2026-07-25",
        startTime: "08:00",
        endTime: "16:00",
        assignedPincodes: ["500001", "500002"],
        maxCapacity: 15,
      },
      "user-admin",
      "Admin"
    );

    expect(shift.technicianId).toBe("phleb-1");
    expect(mockWorkforceRepo.createShift).toHaveBeenCalledTimes(1);
    expect(mockAuditRepo.logAction).toHaveBeenCalledTimes(1);
  });

  it("denies mutation operations for unauthorized roles (Viewer)", async () => {
    await expect(
      service.createExceptionCase(
        {
          fulfillmentId: "f-100",
          region: RegionZone.HYDERABAD_CENTRAL,
          type: ExceptionType.NO_SHOW,
          severity: ExceptionSeverity.HIGH,
          title: "Doorstep No-Show",
          description: "Denied test",
        },
        "user-viewer",
        "Viewer"
      )
    ).rejects.toThrow("Permission Denied");
  });
});
