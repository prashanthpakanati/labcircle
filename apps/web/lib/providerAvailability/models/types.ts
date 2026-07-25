// apps/web/lib/providerAvailability/models/types.ts

import { Timestamp } from "firebase/firestore";
import { ServiceCategory, FulfillmentModel, BookingType, DayOfWeek } from "./enums";

/**
 * Operating hours window for imaging centers.
 */
export interface WorkingHours {
  /** Opening time in HH:mm format (e.g. "08:00"). */
  openTime: string;
  /** Closing time in HH:mm format (e.g. "20:00"). */
  closeTime: string;
}

/**
 * Represents daily working availability, holidays, and daily booking capacity
 * for an Imaging / Radiology Center location.
 */
export interface ImagingCenterAvailability {
  /** Firestore document ID. */
  id: string;
  /** Schema version for forward compatibility & migration control (defaults to 1). */
  version: number;
  /** Parent Corporate Provider ID. */
  providerId: string;
  /** Parent Provider Branch Location ID. */
  providerLocationId: string;
  /** Days of the week when the imaging center is open for visits. */
  workingDays: DayOfWeek[];
  /** Open and close operating hours. */
  workingHours: WorkingHours;
  /** List of holiday dates (ISO YYYY-MM-DD strings) when center is closed. */
  holidays: string[];
  /** Maximum number of center visit bookings allowed per day. */
  dailyCapacity: number;
  /** Flag to toggle active status of center availability schedule. */
  isActive: boolean;
  /** Audit fields. */
  createdBy: string;
  updatedBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt?: Timestamp | null;
  deletedBy?: string | null;
}

/**
 * Single time slot window configuration for technician home collection.
 */
export interface TechnicianTimeSlot {
  /** Unique slot identifier (e.g., "07:00-08:00"). */
  slotId: string;
  /** Start time in HH:mm format. */
  startTime: string;
  /** End time in HH:mm format. */
  endTime: string;
  /** Maximum sample collection capacity for this slot. */
  capacity: number;
  /** Current count of booked collections for this slot. */
  bookedCount: number;
}

/**
 * Daily schedule & serviceable area coverage for a phlebotomist technician.
 */
export interface TechnicianAvailability {
  /** Firestore document ID. */
  id: string;
  /** Schema version (defaults to 1). */
  version: number;
  /** Technician / Phlebotomist user ID. */
  technicianId: string;
  /** Date of service (ISO YYYY-MM-DD string). */
  date: string;
  /** Configured time slots with capacity tracking. */
  timeSlots: TechnicianTimeSlot[];
  /** Serviceable area postal/pincodes assigned to this technician. */
  serviceAreas: string[];
  /** Flag to toggle active status. */
  isActive: boolean;
  /** Audit fields. */
  createdBy: string;
  updatedBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt?: Timestamp | null;
  deletedBy?: string | null;
}

/**
 * Policy definition for a given ServiceCategory.
 * Managed by ServiceBookingPolicyEngine.
 */
export interface ServiceBookingPolicy {
  /** Target service category. */
  category: ServiceCategory;
  /** Mapped high-level fulfillment model. */
  fulfillmentModel: FulfillmentModel;
  /** Permitted booking types for this service category. */
  allowedBookingTypes: BookingType[];
  /** Whether patient selects a specific provider location in UI. */
  providerSelectionRequired: boolean;
  /** Whether a technician is assigned upon booking. */
  technicianAssignmentRequired: boolean;
}

/**
 * Represents a customer booking record in the booking engine.
 */
export interface BookingIntent {
  /** Firestore document ID or draft intent ID. */
  id: string;
  /** Service category (LAB_TEST or RADIOLOGY). */
  serviceCategory: ServiceCategory;
  /** Derived high-level fulfillment model. */
  fulfillmentModel: FulfillmentModel;
  /** System-derived booking type (CENTER_VISIT, HOME_COLLECTION, EXPRESS_COLLECTION). */
  bookingType: BookingType;
  /** Selected visit or collection date (ISO YYYY-MM-DD). */
  bookingDate: string;
  /** Selected time slot string (Null for RADIOLOGY / CENTER_VISIT). */
  bookingTimeSlot?: string | null;
  /** Selected Imaging Center Provider ID (Null for LAB_TEST). */
  providerId?: string | null;
  /** Selected Imaging Center Location ID (Null for LAB_TEST). */
  providerLocationId?: string | null;
  /** Assigned Phlebotomist / Technician ID (Null for RADIOLOGY). */
  technicianId?: string | null;
  /** Patient Pincode for home collection. */
  pincode?: string | null;
  /** Current booking status. */
  status: string;
  /** Audit fields. */
  createdBy: string;
  updatedBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
