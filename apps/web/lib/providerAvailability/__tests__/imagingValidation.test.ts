// apps/web/lib/providerAvailability/__tests__/imagingValidation.test.ts

import { describe, it, expect } from "vitest";
import {
  validateImagingCenterAvailability,
  validateCenterVisitBookingDate,
} from "../validation/validateImagingCenterAvailability";
import { DayOfWeek } from "../models/enums";

describe("validateImagingCenterAvailability", () => {
  it("accepts valid availability configuration", () => {
    const res = validateImagingCenterAvailability({
      providerId: "prov-1",
      providerLocationId: "loc-1",
      workingDays: [DayOfWeek.Monday, DayOfWeek.Tuesday],
      workingHours: { openTime: "08:00", closeTime: "20:00" },
      holidays: ["2026-12-25"],
      dailyCapacity: 150,
      isActive: true,
    });
    expect(res.isValid).toBe(true);
  });

  it("rejects closeTime <= openTime", () => {
    const res = validateImagingCenterAvailability({
      providerId: "prov-1",
      providerLocationId: "loc-1",
      workingDays: [DayOfWeek.Monday],
      workingHours: { openTime: "18:00", closeTime: "08:00" },
      holidays: [],
      dailyCapacity: 100,
      isActive: true,
    });
    expect(res.isValid).toBe(false);
    expect(res.errors["workingHours.closeTime"]).toMatch(/strictly after/);
  });
});

describe("validateCenterVisitBookingDate", () => {
  const workingDays = [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday];
  const holidays = ["2026-08-15"];
  const capacity = 10;

  it("rejects booking on a holiday", () => {
    const res = validateCenterVisitBookingDate(workingDays, holidays, capacity, "2026-08-15", 0);
    expect(res.isValid).toBe(false);
    expect(res.errors.date).toMatch(/holiday/);
  });

  it("rejects booking on a non-working day (e.g. Tuesday 2026-07-28)", () => {
    // 2026-07-28 is a Tuesday
    const res = validateCenterVisitBookingDate(workingDays, holidays, capacity, "2026-07-28", 0);
    expect(res.isValid).toBe(false);
    expect(res.errors.date).toMatch(/closed on Tuesday/);
  });

  it("rejects booking when daily capacity is reached", () => {
    // 2026-07-27 is a Monday
    const res = validateCenterVisitBookingDate(workingDays, holidays, capacity, "2026-07-27", 10);
    expect(res.isValid).toBe(false);
    expect(res.errors.capacity).toMatch(/capacity \(10\) for 2026-07-27 has been reached/);
  });

  it("allows booking on a valid working day with open capacity", () => {
    // 2026-07-27 is a Monday
    const res = validateCenterVisitBookingDate(workingDays, holidays, capacity, "2026-07-27", 5);
    expect(res.isValid).toBe(true);
  });
});
