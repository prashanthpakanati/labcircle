// apps/web/lib/providerAvailability/__tests__/technicianValidation.test.ts

import { describe, it, expect } from "vitest";
import {
  validateHomeCollectionSlot,
  checkExpressEligibility,
} from "../validation/validateTechnicianAvailability";
import { TechnicianAvailability } from "../models/types";
import { Timestamp } from "firebase/firestore";

const mockSchedules: TechnicianAvailability[] = [
  {
    id: "tech-sched-1",
    version: 1,
    technicianId: "phleb-001",
    date: "2026-07-28",
    serviceAreas: ["500001", "500002"],
    isActive: true,
    timeSlots: [
      { slotId: "07:00-08:00", startTime: "07:00", endTime: "08:00", capacity: 3, bookedCount: 1 },
      { slotId: "08:00-09:00", startTime: "08:00", endTime: "09:00", capacity: 3, bookedCount: 3 }, // Full
    ],
    createdBy: "admin",
    updatedBy: "admin",
    createdAt: { seconds: 1000 } as unknown as Timestamp,
    updatedAt: { seconds: 1000 } as unknown as Timestamp,
  },
];

describe("validateHomeCollectionSlot", () => {
  it("rejects unserviceable pincode", () => {
    const res = validateHomeCollectionSlot(mockSchedules, "999999", "07:00-08:00");
    expect(res.isValid).toBe(false);
    expect(res.errors.pincode).toMatch(/currently unavailable/);
    expect(res.assignedTechnicianId).toBeNull();
  });

  it("rejects fully booked time slot", () => {
    const res = validateHomeCollectionSlot(mockSchedules, "500001", "08:00-09:00");
    expect(res.isValid).toBe(false);
    expect(res.errors.slot).toMatch(/fully booked/);
  });

  it("validates available time slot and assigns phlebotomist", () => {
    const res = validateHomeCollectionSlot(mockSchedules, "500001", "07:00-08:00");
    expect(res.isValid).toBe(true);
    expect(res.assignedTechnicianId).toBe("phleb-001");
  });
});

describe("checkExpressEligibility", () => {
  it("confirms Express eligibility for pincode with active phlebotomist capacity", () => {
    const res = checkExpressEligibility(mockSchedules, "500001");
    expect(res.isExpressAvailable).toBe(true);
    expect(res.assignedTechnicianId).toBe("phleb-001");
  });

  it("rejects Express for unserviceable pincode", () => {
    const res = checkExpressEligibility(mockSchedules, "999999");
    expect(res.isExpressAvailable).toBe(false);
    expect(res.assignedTechnicianId).toBeNull();
  });
});
