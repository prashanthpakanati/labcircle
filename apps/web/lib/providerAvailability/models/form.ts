// apps/web/lib/providerAvailability/models/form.ts

import { DayOfWeek } from "./enums";
import { WorkingHours, TechnicianTimeSlot } from "./types";

/**
 * Form data structure for configuring Imaging Center Availability.
 */
export interface ImagingCenterAvailabilityFormData {
  providerId: string;
  providerLocationId: string;
  workingDays: DayOfWeek[];
  workingHours: WorkingHours;
  holidays: string[]; // YYYY-MM-DD strings
  dailyCapacity: number;
  isActive: boolean;
}

/**
 * Form data structure for configuring Technician Availability schedules.
 */
export interface TechnicianAvailabilityFormData {
  technicianId: string;
  date: string; // YYYY-MM-DD
  timeSlots: TechnicianTimeSlot[];
  serviceAreas: string[]; // Array of pincodes
  isActive: boolean;
}
