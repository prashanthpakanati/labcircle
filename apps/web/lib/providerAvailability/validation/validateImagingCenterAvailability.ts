// apps/web/lib/providerAvailability/validation/validateImagingCenterAvailability.ts

import { ImagingCenterAvailabilityFormData } from "../models/form";
import { DayOfWeek } from "../models/enums";

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<string, string>>;
}

/**
 * Validates HH:mm time string format.
 */
function isValidTimeFormat(timeStr: string): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(timeStr);
}

/**
 * Validates YYYY-MM-DD date string format.
 */
function isValidDateFormat(dateStr: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

/**
 * Validates form input for configuring Imaging Center Availability schedules.
 */
export function validateImagingCenterAvailability(
  data: ImagingCenterAvailabilityFormData
): ValidationResult {
  const errors: Partial<Record<string, string>> = {};

  if (!data.providerId?.trim()) {
    errors.providerId = "providerId is required";
  }

  if (!data.providerLocationId?.trim()) {
    errors.providerLocationId = "providerLocationId is required";
  }

  if (!data.workingDays || data.workingDays.length === 0) {
    errors.workingDays = "At least one working day must be selected";
  } else {
    const validDays = Object.values(DayOfWeek);
    for (const day of data.workingDays) {
      if (!validDays.includes(day)) {
        errors.workingDays = `Invalid day of week: ${day}`;
        break;
      }
    }
  }

  if (!data.workingHours) {
    errors.workingHours = "Working hours configuration is required";
  } else {
    const { openTime, closeTime } = data.workingHours;
    if (!openTime || !isValidTimeFormat(openTime)) {
      errors["workingHours.openTime"] = "Valid open time (HH:mm) is required";
    }
    if (!closeTime || !isValidTimeFormat(closeTime)) {
      errors["workingHours.closeTime"] = "Valid close time (HH:mm) is required";
    }
    if (openTime && closeTime && openTime >= closeTime) {
      errors["workingHours.closeTime"] = "Close time must be strictly after open time";
    }
  }

  if (data.dailyCapacity === undefined || data.dailyCapacity === null) {
    errors.dailyCapacity = "Daily capacity is required";
  } else if (!Number.isInteger(data.dailyCapacity) || data.dailyCapacity <= 0) {
    errors.dailyCapacity = "Daily capacity must be a positive integer greater than 0";
  }

  if (data.holidays && data.holidays.length > 0) {
    for (const holiday of data.holidays) {
      if (!isValidDateFormat(holiday)) {
        errors.holidays = `Invalid holiday date format: ${holiday}. Expected YYYY-MM-DD.`;
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
 * Validates a Center Visit booking attempt against a center's availability schedule.
 *
 * Rules:
 *  1. Selected date must not be a holiday.
 *  2. Day of week must be an open working day.
 *  3. Current daily bookings count must not exceed daily capacity limit.
 *
 * @param workingDays - Center working days.
 * @param holidays - Center holidays array (YYYY-MM-DD).
 * @param dailyCapacity - Configured max daily booking capacity.
 * @param targetDateStr - Target booking date (YYYY-MM-DD).
 * @param currentBookingsCount - Current count of confirmed center visits for that date.
 */
export function validateCenterVisitBookingDate(
  workingDays: DayOfWeek[],
  holidays: string[],
  dailyCapacity: number,
  targetDateStr: string,
  currentBookingsCount: number
): ValidationResult {
  const errors: Partial<Record<string, string>> = {};

  if (!isValidDateFormat(targetDateStr)) {
    errors.date = "Invalid date format. Expected YYYY-MM-DD.";
    return { isValid: false, errors };
  }

  // 1. Holiday Check
  if (holidays.includes(targetDateStr)) {
    errors.date = `The selected date (${targetDateStr}) is a holiday. The center is closed.`;
    return { isValid: false, errors };
  }

  // 2. Working Day Check
  const dateObj = new Date(targetDateStr + "T00:00:00");
  const dayNameIndex = dateObj.getDay(); // 0 = Sunday, 1 = Monday, ...
  const dayNames: DayOfWeek[] = [
    DayOfWeek.Sunday,
    DayOfWeek.Monday,
    DayOfWeek.Tuesday,
    DayOfWeek.Wednesday,
    DayOfWeek.Thursday,
    DayOfWeek.Friday,
    DayOfWeek.Saturday,
  ];
  const dayOfWeek = dayNames[dayNameIndex];

  if (!workingDays.includes(dayOfWeek)) {
    errors.date = `The center is closed on ${dayOfWeek}s.`;
    return { isValid: false, errors };
  }

  // 3. Daily Capacity Check
  if (currentBookingsCount >= dailyCapacity) {
    errors.capacity = `Daily booking capacity (${dailyCapacity}) for ${targetDateStr} has been reached.`;
    return { isValid: false, errors };
  }

  return { isValid: true, errors: {} };
}
