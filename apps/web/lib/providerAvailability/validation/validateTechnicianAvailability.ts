// apps/web/lib/providerAvailability/validation/validateTechnicianAvailability.ts

import { TechnicianAvailabilityFormData } from "../models/form";
import { TechnicianAvailability } from "../models/types";
import { ValidationResult } from "./validateImagingCenterAvailability";

/**
 * Validates form input for configuring Technician Availability schedules.
 */
export function validateTechnicianAvailability(
  data: TechnicianAvailabilityFormData
): ValidationResult {
  const errors: Partial<Record<string, string>> = {};

  if (!data.technicianId?.trim()) {
    errors.technicianId = "technicianId is required";
  }

  if (!data.date?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(data.date.trim())) {
    errors.date = "Valid date (YYYY-MM-DD) is required";
  }

  if (!data.serviceAreas || data.serviceAreas.length === 0) {
    errors.serviceAreas = "At least one serviceable pincode/area is required";
  } else {
    for (const pincode of data.serviceAreas) {
      if (!/^\d{6}$/.test(pincode.trim())) {
        errors.serviceAreas = `Invalid Indian pincode format: ${pincode}. Must be 6 digits.`;
        break;
      }
    }
  }

  if (!data.timeSlots || data.timeSlots.length === 0) {
    errors.timeSlots = "At least one time slot must be configured";
  } else {
    for (const slot of data.timeSlots) {
      if (!slot.slotId?.trim()) {
        errors.timeSlots = "Slot ID is required";
        break;
      }
      if (slot.capacity < 1) {
        errors.timeSlots = "Slot capacity must be at least 1";
        break;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates Home Collection time slot availability for a patient pincode on a specific date.
 * Automatically checks technician coverage, pincode eligibility, and slot capacity.
 *
 * @param schedules - List of active technician schedules for the target date.
 * @param pincode - Patient delivery pincode (6-digit string).
 * @param targetSlotId - Desired time slot ID (e.g. "07:00-08:00").
 * @returns Object with validation status, error messages, and matched technician ID (if available).
 */
export function validateHomeCollectionSlot(
  schedules: TechnicianAvailability[],
  pincode: string,
  targetSlotId: string
): { isValid: boolean; errors: Partial<Record<string, string>>; assignedTechnicianId: string | null } {
  const errors: Partial<Record<string, string>> = {};
  const normalizedPincode = pincode.trim();

  // 1. Filter technicians covering patient's pincode
  const matchingTechs = schedules.filter(
    (s) => s.isActive && !s.deletedAt && s.serviceAreas.includes(normalizedPincode)
  );

  if (matchingTechs.length === 0) {
    errors.pincode = `Home sample collection is currently unavailable for pincode ${normalizedPincode}.`;
    return { isValid: false, errors, assignedTechnicianId: null };
  }

  // 2. Find a technician with open capacity in the requested slot
  for (const tech of matchingTechs) {
    const slot = tech.timeSlots.find((s: { slotId: string }) => s.slotId === targetSlotId);
    if (slot && slot.bookedCount < slot.capacity) {
      return { isValid: true, errors: {}, assignedTechnicianId: tech.technicianId };
    }
  }

  errors.slot = `The selected time slot (${targetSlotId}) is fully booked for pincode ${normalizedPincode}.`;
  return { isValid: false, errors, assignedTechnicianId: null };
}

/**
 * Checks Express 60-Minute Home Collection eligibility for a patient pincode.
 * Requires an active technician on duty covering the pincode with available overall capacity.
 *
 * @param schedules - Active technician schedules for today's date.
 * @param pincode - Patient delivery pincode.
 * @returns Object with availability flag and assigned technician ID.
 */
export function checkExpressEligibility(
  schedules: TechnicianAvailability[],
  pincode: string
): { isExpressAvailable: boolean; assignedTechnicianId: string | null } {
  const normalizedPincode = pincode.trim();

  const matchingTechs = schedules.filter(
    (s) => s.isActive && !s.deletedAt && s.serviceAreas.includes(normalizedPincode)
  );

  for (const tech of matchingTechs) {
    // Check if technician has at least one open time slot today
    const hasCapacity = tech.timeSlots.some((s: { bookedCount: number; capacity: number }) => s.bookedCount < s.capacity);
    if (hasCapacity) {
      return { isExpressAvailable: true, assignedTechnicianId: tech.technicianId };
    }
  }

  return { isExpressAvailable: false, assignedTechnicianId: null };
}
