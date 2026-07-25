// apps/web/lib/providerAvailability/services/ImagingCenterAvailabilityService.ts

import { collection, doc, getFirestore, serverTimestamp, Timestamp } from "firebase/firestore";
import { ImagingCenterAvailabilityRepository } from "../repositories/ImagingCenterAvailabilityRepository";
import { TechnicianAvailabilityRepository } from "../repositories/TechnicianAvailabilityRepository";
import { ImagingCenterAvailability, TechnicianAvailability, BookingIntent } from "../models/types";
import { ServiceCategory, BookingType } from "../models/enums";
import { ImagingCenterAvailabilityFormData, TechnicianAvailabilityFormData } from "../models/form";
import { validateImagingCenterAvailability, validateCenterVisitBookingDate } from "../validation/validateImagingCenterAvailability";
import { validateTechnicianAvailability, validateHomeCollectionSlot, checkExpressEligibility } from "../validation/validateTechnicianAvailability";
import { ServiceBookingPolicyEngine } from "../utils/ServiceBookingPolicyEngine";

export type AppRole = "SuperAdmin" | "Admin" | "Editor" | "Viewer";

const MUTATION_ROLES: AppRole[] = ["SuperAdmin", "Admin", "Editor"];
const DELETE_ROLES: AppRole[] = ["SuperAdmin", "Admin"];

export class ImagingCenterAvailabilityService {
  private centerRepo = new ImagingCenterAvailabilityRepository();
  private techRepo = new TechnicianAvailabilityRepository();
  private db = getFirestore();

  private assertRole(userRole: AppRole, allowedRoles: AppRole[], action: string): void {
    if (!allowedRoles.includes(userRole)) {
      throw new Error(
        `Permission denied: role '${userRole}' is not authorized to ${action}. ` +
          `Required roles: ${allowedRoles.join(", ")}`
      );
    }
  }

  // ── Imaging Center Availability CRUD ─────────────────────────────────────

  async getImagingCenterAvailability(id: string): Promise<ImagingCenterAvailability | null> {
    return this.centerRepo.getById(id);
  }

  async getImagingCenterAvailabilityByLocation(
    providerLocationId: string
  ): Promise<ImagingCenterAvailability | null> {
    return this.centerRepo.getByProviderLocationId(providerLocationId);
  }

  async createImagingCenterAvailability(
    formData: ImagingCenterAvailabilityFormData,
    userId: string,
    userRole: AppRole
  ): Promise<ImagingCenterAvailability> {
    this.assertRole(userRole, MUTATION_ROLES, "create imaging center availability");

    const val = validateImagingCenterAvailability(formData);
    if (!val.isValid) {
      throw new Error(`Validation failed: ${JSON.stringify(val.errors)}`);
    }

    const id = doc(collection(this.db, "imaging_center_availability")).id;
    const now = serverTimestamp() as unknown as Timestamp;

    const availability: ImagingCenterAvailability = {
      id,
      version: 1,
      providerId: formData.providerId,
      providerLocationId: formData.providerLocationId,
      workingDays: formData.workingDays,
      workingHours: formData.workingHours,
      holidays: formData.holidays,
      dailyCapacity: formData.dailyCapacity,
      isActive: formData.isActive,
      createdBy: userId,
      updatedBy: userId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      deletedBy: null,
    };

    await this.centerRepo.create(availability);
    return availability;
  }

  async updateImagingCenterAvailability(
    id: string,
    formData: Partial<ImagingCenterAvailabilityFormData>,
    userId: string,
    userRole: AppRole
  ): Promise<void> {
    this.assertRole(userRole, MUTATION_ROLES, "update imaging center availability");

    const existing = await this.centerRepo.getById(id);
    if (!existing) throw new Error(`Availability '${id}' not found`);

    const merged: ImagingCenterAvailabilityFormData = {
      providerId: existing.providerId,
      providerLocationId: existing.providerLocationId,
      workingDays: formData.workingDays ?? existing.workingDays,
      workingHours: formData.workingHours ?? existing.workingHours,
      holidays: formData.holidays ?? existing.holidays,
      dailyCapacity: formData.dailyCapacity ?? existing.dailyCapacity,
      isActive: formData.isActive ?? existing.isActive,
    };

    const val = validateImagingCenterAvailability(merged);
    if (!val.isValid) {
      throw new Error(`Validation failed: ${JSON.stringify(val.errors)}`);
    }

    const now = serverTimestamp() as unknown as Timestamp;
    await this.centerRepo.update({
      ...existing,
      workingDays: merged.workingDays,
      workingHours: merged.workingHours,
      holidays: merged.holidays,
      dailyCapacity: merged.dailyCapacity,
      isActive: merged.isActive,
      updatedBy: userId,
      updatedAt: now,
    });
  }

  async deleteImagingCenterAvailability(
    id: string,
    userId: string,
    userRole: AppRole
  ): Promise<void> {
    this.assertRole(userRole, DELETE_ROLES, "delete imaging center availability");
    const existing = await this.centerRepo.getById(id);
    if (!existing) throw new Error(`Availability '${id}' not found`);
    await this.centerRepo.softDelete(id, userId);
  }

  async restoreImagingCenterAvailability(
    id: string,
    userRole: AppRole
  ): Promise<void> {
    this.assertRole(userRole, MUTATION_ROLES, "restore imaging center availability");
    await this.centerRepo.restore(id);
  }

  // ── Technician Availability CRUD ──────────────────────────────────────────

  async createTechnicianAvailability(
    formData: TechnicianAvailabilityFormData,
    userId: string,
    userRole: AppRole
  ): Promise<TechnicianAvailability> {
    this.assertRole(userRole, MUTATION_ROLES, "create technician availability");

    const val = validateTechnicianAvailability(formData);
    if (!val.isValid) {
      throw new Error(`Validation failed: ${JSON.stringify(val.errors)}`);
    }

    const id = doc(collection(this.db, "technician_availability")).id;
    const now = serverTimestamp() as unknown as Timestamp;

    const availability: TechnicianAvailability = {
      id,
      version: 1,
      technicianId: formData.technicianId,
      date: formData.date,
      timeSlots: formData.timeSlots,
      serviceAreas: formData.serviceAreas,
      isActive: formData.isActive,
      createdBy: userId,
      updatedBy: userId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      deletedBy: null,
    };

    await this.techRepo.create(availability);
    return availability;
  }

  // ── Service Booking Intent Engine ──────────────────────────────────────────

  /**
   * Evaluates & creates a Booking Intent using ServiceBookingPolicyEngine rules.
   * System-derives BookingType and enforces policy validation.
   */
  async createBookingIntent(
    category: ServiceCategory,
    dateStr: string,
    options: {
      providerLocationId?: string;
      timeSlotId?: string;
      pincode?: string;
      isExpress?: boolean;
      currentDailyBookingsCount?: number;
    },
    userId: string
  ): Promise<BookingIntent> {
    const policy = ServiceBookingPolicyEngine.getPolicy(category);
    const bookingType = ServiceBookingPolicyEngine.deriveBookingType(category, options.isExpress);

    ServiceBookingPolicyEngine.validateRequest(category, bookingType, options.providerLocationId);

    let assignedTechnicianId: string | null = null;
    let finalTimeSlot: string | null = null;

    if (category === ServiceCategory.RADIOLOGY) {
      // 1. Validate Imaging Center Availability
      if (!options.providerLocationId) {
        throw new Error("providerLocationId is required for RADIOLOGY center visits.");
      }

      const centerAvail = await this.centerRepo.getByProviderLocationId(options.providerLocationId);
      if (!centerAvail || !centerAvail.isActive) {
        throw new Error("Imaging center is currently not active or available for bookings.");
      }

      const dateVal = validateCenterVisitBookingDate(
        centerAvail.workingDays,
        centerAvail.holidays,
        centerAvail.dailyCapacity,
        dateStr,
        options.currentDailyBookingsCount ?? 0
      );

      if (!dateVal.isValid) {
        throw new Error(`Center Visit validation failed: ${JSON.stringify(dateVal.errors)}`);
      }

      finalTimeSlot = null; // Time slot MUST be null for Center Visit
    } else if (category === ServiceCategory.LAB_TEST) {
      // 2. Validate Home Collection / Express Phlebotomist Availability
      if (!options.pincode) {
        throw new Error("Pincode is required for LAB_TEST home collection.");
      }

      const techSchedules = await this.techRepo.getByDateAndPincode(dateStr, options.pincode);

      if (bookingType === BookingType.EXPRESS_COLLECTION) {
        const expressCheck = checkExpressEligibility(techSchedules, options.pincode);
        if (!expressCheck.isExpressAvailable) {
          throw new Error(`LabCircle Express 60-Minute Collection is currently unavailable for pincode ${options.pincode}.`);
        }
        assignedTechnicianId = expressCheck.assignedTechnicianId;
        finalTimeSlot = "EXPRESS_60_MIN";
      } else {
        if (!options.timeSlotId) {
          throw new Error("Time slot ID is required for scheduled home collection.");
        }
        const slotVal = validateHomeCollectionSlot(techSchedules, options.pincode, options.timeSlotId);
        if (!slotVal.isValid) {
          throw new Error(`Home Collection validation failed: ${JSON.stringify(slotVal.errors)}`);
        }
        assignedTechnicianId = slotVal.assignedTechnicianId;
        finalTimeSlot = options.timeSlotId;
      }
    }

    const id = doc(collection(this.db, "bookings")).id;
    const now = serverTimestamp() as unknown as Timestamp;

    const intent: BookingIntent = {
      id,
      serviceCategory: category,
      fulfillmentModel: policy.fulfillmentModel,
      bookingType,
      bookingDate: dateStr,
      bookingTimeSlot: finalTimeSlot,
      providerId: category === ServiceCategory.RADIOLOGY ? options.providerLocationId : null,
      providerLocationId: category === ServiceCategory.RADIOLOGY ? options.providerLocationId : null,
      technicianId: assignedTechnicianId,
      pincode: options.pincode ?? null,
      status: "CONFIRMED",
      createdBy: userId,
      updatedBy: userId,
      createdAt: now,
      updatedAt: now,
    };

    return intent;
  }
}
