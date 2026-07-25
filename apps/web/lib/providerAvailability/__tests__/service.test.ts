// apps/web/lib/providerAvailability/__tests__/service.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ServiceCategory, BookingType, FulfillmentModel, DayOfWeek } from "../models/enums";
import { Timestamp } from "firebase/firestore";

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn(() => ({})),
    doc: vi.fn(() => ({ id: "intent-123" })),
    serverTimestamp: vi.fn(() => Timestamp.now()),
  };
});

const mockCenterRepo = {
  create: vi.fn().mockResolvedValue(undefined),
  getById: vi.fn().mockResolvedValue(null),
  getByProviderLocationId: vi.fn().mockResolvedValue({
    id: "avail-1",
    providerId: "prov-1",
    providerLocationId: "loc-1",
    workingDays: [DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday, DayOfWeek.Thursday, DayOfWeek.Friday, DayOfWeek.Saturday],
    workingHours: { openTime: "08:00", closeTime: "20:00" },
    holidays: [],
    dailyCapacity: 100,
    isActive: true,
  }),
  update: vi.fn().mockResolvedValue(undefined),
  softDelete: vi.fn().mockResolvedValue(undefined),
  restore: vi.fn().mockResolvedValue(undefined),
};

const mockTechRepo = {
  create: vi.fn().mockResolvedValue(undefined),
  getByDateAndPincode: vi.fn().mockResolvedValue([
    {
      id: "tech-1",
      technicianId: "phleb-001",
      date: "2026-07-28",
      serviceAreas: ["500001"],
      isActive: true,
      timeSlots: [
        { slotId: "07:00-08:00", startTime: "07:00", endTime: "08:00", capacity: 5, bookedCount: 0 },
      ],
    },
  ]),
};

vi.mock("../repositories/ImagingCenterAvailabilityRepository", () => ({
  ImagingCenterAvailabilityRepository: vi.fn(function () {
    return mockCenterRepo;
  }),
}));

vi.mock("../repositories/TechnicianAvailabilityRepository", () => ({
  TechnicianAvailabilityRepository: vi.fn(function () {
    return mockTechRepo;
  }),
}));

const { ImagingCenterAvailabilityService } = await import("../services/ImagingCenterAvailabilityService");

describe("ImagingCenterAvailabilityService", () => {
  let service: InstanceType<typeof ImagingCenterAvailabilityService>;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ImagingCenterAvailabilityService();
  });

  it("creates RADIOLOGY Center Visit booking intent with NULL time slot", async () => {
    // 2026-07-27 is a Monday
    const intent = await service.createBookingIntent(
      ServiceCategory.RADIOLOGY,
      "2026-07-27",
      { providerLocationId: "loc-1" },
      "user-1"
    );

    expect(intent.serviceCategory).toBe(ServiceCategory.RADIOLOGY);
    expect(intent.fulfillmentModel).toBe(FulfillmentModel.CENTER_VISIT);
    expect(intent.bookingType).toBe(BookingType.CENTER_VISIT);
    expect(intent.bookingTimeSlot).toBeNull();
    expect(intent.providerLocationId).toBe("loc-1");
  });

  it("creates LAB_TEST Scheduled Home Collection intent with assigned phlebotomist", async () => {
    const intent = await service.createBookingIntent(
      ServiceCategory.LAB_TEST,
      "2026-07-28",
      { timeSlotId: "07:00-08:00", pincode: "500001" },
      "user-1"
    );

    expect(intent.serviceCategory).toBe(ServiceCategory.LAB_TEST);
    expect(intent.fulfillmentModel).toBe(FulfillmentModel.HOME_COLLECTION);
    expect(intent.bookingType).toBe(BookingType.HOME_COLLECTION);
    expect(intent.bookingTimeSlot).toBe("07:00-08:00");
    expect(intent.technicianId).toBe("phleb-001");
    expect(intent.providerLocationId).toBeNull(); // Lab selection hidden from patient
  });

  it("creates LAB_TEST Express 60-Minute intent", async () => {
    const intent = await service.createBookingIntent(
      ServiceCategory.LAB_TEST,
      "2026-07-28",
      { pincode: "500001", isExpress: true },
      "user-1"
    );

    expect(intent.serviceCategory).toBe(ServiceCategory.LAB_TEST);
    expect(intent.bookingType).toBe(BookingType.EXPRESS_COLLECTION);
    expect(intent.bookingTimeSlot).toBe("EXPRESS_60_MIN");
    expect(intent.technicianId).toBe("phleb-001");
  });

  it("denies mutation actions for Viewer role", async () => {
    await expect(
      service.createImagingCenterAvailability(
        {
          providerId: "p1",
          providerLocationId: "l1",
          workingDays: [DayOfWeek.Monday],
          workingHours: { openTime: "08:00", closeTime: "17:00" },
          holidays: [],
          dailyCapacity: 50,
          isActive: true,
        },
        "user-1",
        "Viewer"
      )
    ).rejects.toThrow("Permission denied");
  });
});
