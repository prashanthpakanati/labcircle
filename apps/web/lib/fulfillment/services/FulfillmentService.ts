// apps/web/lib/fulfillment/services/FulfillmentService.ts

import { collection, doc, getFirestore, serverTimestamp, Timestamp } from "firebase/firestore";
import { FulfillmentRepository, FulfillmentSearchFilters } from "../repositories/FulfillmentRepository";
import { FulfillmentTimelineRepository } from "../repositories/FulfillmentTimelineRepository";
import { CollectionVerificationRepository } from "../repositories/CollectionVerificationRepository";
import { SampleRepository } from "../repositories/SampleRepository";
import { TechnicianLocationRepository } from "../repositories/TechnicianLocationRepository";
import { Fulfillment, FulfillmentTimelineEvent, CollectionVerification, Sample, ProcessingPartner } from "../models/types";
import { FulfillmentStatus, FulfillmentPriority, VerificationStatus, TimelineEventType, AllocationStrategyType, AssignmentStrategyType } from "../models/enums";
import { CreateFulfillmentFormData, CreateSampleFormData, UpdateTechnicianLocationFormData } from "../models/form";
import { FulfillmentStateMachine } from "../utils/FulfillmentStateMachine";
import { CollectionVerificationEngine } from "../utils/CollectionVerificationEngine";
import { PartnerAllocationEngine } from "../utils/PartnerAllocationEngine";
import { TechnicianAssignmentEngine, TechnicianCandidate } from "../utils/TechnicianAssignmentEngine";
import { validateSampleCreation } from "../validation/validateFulfillment";
import type { DocumentSnapshot } from "firebase/firestore";

export type AppRole = "SuperAdmin" | "Admin" | "Editor" | "Technician" | "Viewer";

const MUTATION_ROLES: AppRole[] = ["SuperAdmin", "Admin", "Editor", "Technician"];
const ADMIN_ROLES: AppRole[] = ["SuperAdmin", "Admin"];

export class FulfillmentService {
  private repo = new FulfillmentRepository();
  private timelineRepo = new FulfillmentTimelineRepository();
  private verificationRepo = new CollectionVerificationRepository();
  private sampleRepo = new SampleRepository();
  private locationRepo = new TechnicianLocationRepository();
  private db = getFirestore();

  private assertRole(userRole: AppRole, allowedRoles: AppRole[], action: string): void {
    if (!allowedRoles.includes(userRole)) {
      throw new Error(`Permission denied: role '${userRole}' is not authorized to ${action}.`);
    }
  }

  private async recordTimelineEvent(
    fulfillmentId: string,
    eventType: TimelineEventType,
    prevStatus: FulfillmentStatus,
    currStatus: FulfillmentStatus,
    actorId: string,
    actorRole: string,
    notes?: string,
    location?: { latitude: number; longitude: number } | null
  ): Promise<void> {
    const id = doc(collection(this.db, "fulfillment_timeline")).id;
    const now = serverTimestamp() as unknown as Timestamp;

    const event: FulfillmentTimelineEvent = {
      id,
      fulfillmentId,
      eventType,
      previousStatus: prevStatus,
      currentStatus: currStatus,
      performedBy: actorId,
      performedByRole: actorRole,
      timestamp: now,
      notes,
      location,
    };

    await this.timelineRepo.addEvent(event);
  }

  // ── Public API ──────────────────────────────────────────────────────────

  async getFulfillment(id: string): Promise<Fulfillment | null> {
    return this.repo.getById(id);
  }

  async listFulfillments(
    filters: FulfillmentSearchFilters = {},
    pageSize = 20,
    cursor?: DocumentSnapshot
  ): Promise<{ fulfillments: Fulfillment[]; nextCursor?: DocumentSnapshot }> {
    return this.repo.search(filters, pageSize, cursor);
  }

  async getTimeline(fulfillmentId: string): Promise<FulfillmentTimelineEvent[]> {
    return this.timelineRepo.getByFulfillmentId(fulfillmentId);
  }

  async getSamples(fulfillmentId: string): Promise<Sample[]> {
    return this.sampleRepo.getByFulfillmentId(fulfillmentId);
  }

  /**
   * Initializes a new operational Fulfillment document + hashed OTP CollectionVerification record.
   */
  async createFulfillment(
    formData: CreateFulfillmentFormData,
    userId: string,
    userRole: AppRole
  ): Promise<{ fulfillment: Fulfillment; plaintextOtp: string }> {
    this.assertRole(userRole, MUTATION_ROLES, "create fulfillment");

    const id = doc(collection(this.db, "fulfillments")).id;
    const now = serverTimestamp() as unknown as Timestamp;

    const fulfillment: Fulfillment = {
      id,
      version: 1,
      bookingId: formData.bookingId,
      serviceCategory: formData.serviceCategory,
      fulfillmentStatus: FulfillmentStatus.FULFILLMENT_CREATED,
      priority: formData.priority ?? FulfillmentPriority.STANDARD,
      pincode: formData.pincode ?? null,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
    };

    await this.repo.create(fulfillment);

    // Record initial timeline event
    await this.recordTimelineEvent(
      id,
      TimelineEventType.OPERATIONAL,
      FulfillmentStatus.BOOKED,
      FulfillmentStatus.FULFILLMENT_CREATED,
      userId,
      userRole,
      "Fulfillment record initialized"
    );

    // Create CollectionVerification domain record with SHA-256 hashed OTP
    const plaintextOtp = CollectionVerificationEngine.generatePlaintextOtp();
    const otpHash = await CollectionVerificationEngine.hashOtp(plaintextOtp);
    const verificationId = doc(collection(this.db, "collection_verifications")).id;

    const verification: CollectionVerification = {
      id: verificationId,
      fulfillmentId: id,
      otpHash,
      expiresAt: Timestamp.fromDate(CollectionVerificationEngine.computeExpiryTimestamp()),
      verifiedAt: null,
      attemptCount: 0,
      maxAttempts: 3,
      status: VerificationStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    };

    await this.verificationRepo.create(verification);

    return { fulfillment, plaintextOtp };
  }

  /**
   * Assigns a phlebotomist technician using TechnicianAssignmentEngine strategies.
   */
  async assignTechnician(
    fulfillmentId: string,
    candidates: TechnicianCandidate[],
    strategyType: AssignmentStrategyType,
    userId: string,
    userRole: AppRole
  ): Promise<void> {
    this.assertRole(userRole, MUTATION_ROLES, "assign technician");

    const existing = await this.repo.getById(fulfillmentId);
    if (!existing) throw new Error(`Fulfillment '${fulfillmentId}' not found`);

    FulfillmentStateMachine.validateTransition(
      existing.fulfillmentStatus,
      FulfillmentStatus.TECHNICIAN_ASSIGNED
    );

    const assignment = TechnicianAssignmentEngine.assign(
      candidates,
      existing.pincode ?? "500001",
      strategyType
    );

    const now = serverTimestamp() as unknown as Timestamp;
    const updated: Fulfillment = {
      ...existing,
      assignedTechnicianId: assignment.selectedTechnicianId,
      fulfillmentStatus: FulfillmentStatus.TECHNICIAN_ASSIGNED,
      updatedBy: userId,
      updatedAt: now,
    };

    await this.repo.update(updated);

    await this.recordTimelineEvent(
      fulfillmentId,
      TimelineEventType.OPERATIONAL,
      existing.fulfillmentStatus,
      FulfillmentStatus.TECHNICIAN_ASSIGNED,
      userId,
      userRole,
      `Assigned phlebotomist '${assignment.selectedTechnicianId}' using ${assignment.strategyUsed} strategy (${assignment.reason})`
    );
  }

  /**
   * Transition status machine forward.
   */
  async transitionStatus(
    fulfillmentId: string,
    targetStatus: FulfillmentStatus,
    userId: string,
    userRole: AppRole,
    notes?: string,
    location?: { latitude: number; longitude: number } | null
  ): Promise<void> {
    this.assertRole(userRole, MUTATION_ROLES, `transition status to '${targetStatus}'`);

    const existing = await this.repo.getById(fulfillmentId);
    if (!existing) throw new Error(`Fulfillment '${fulfillmentId}' not found`);

    FulfillmentStateMachine.validateTransition(existing.fulfillmentStatus, targetStatus);

    const now = serverTimestamp() as unknown as Timestamp;
    const updated: Fulfillment = {
      ...existing,
      fulfillmentStatus: targetStatus,
      updatedBy: userId,
      updatedAt: now,
    };

    await this.repo.update(updated);

    await this.recordTimelineEvent(
      fulfillmentId,
      TimelineEventType.OPERATIONAL,
      existing.fulfillmentStatus,
      targetStatus,
      userId,
      userRole,
      notes ?? `Status updated to ${targetStatus}`,
      location
    );
  }

  /**
   * Verifies plaintext OTP against CollectionVerification security domain.
   */
  async verifyOtp(
    fulfillmentId: string,
    attemptPlaintextOtp: string,
    userId: string,
    userRole: AppRole
  ): Promise<boolean> {
    this.assertRole(userRole, MUTATION_ROLES, "verify collection OTP");

    const existing = await this.repo.getById(fulfillmentId);
    if (!existing) throw new Error(`Fulfillment '${fulfillmentId}' not found`);

    const verification = await this.verificationRepo.getByFulfillmentId(fulfillmentId);
    if (!verification) throw new Error(`No verification record found for fulfillment '${fulfillmentId}'`);

    const res = await CollectionVerificationEngine.verifyAttempt(verification, attemptPlaintextOtp);

    const now = serverTimestamp() as unknown as Timestamp;
    await this.verificationRepo.update({
      ...verification,
      ...res.updatedVerification,
      verifiedAt: res.success ? now : verification.verifiedAt,
      updatedAt: now,
    } as CollectionVerification);

    if (res.success) {
      await this.transitionStatus(
        fulfillmentId,
        FulfillmentStatus.OTP_VERIFIED,
        userId,
        userRole,
        "OTP verification successful"
      );
    } else {
      await this.recordTimelineEvent(
        fulfillmentId,
        TimelineEventType.AUDIT,
        existing.fulfillmentStatus,
        existing.fulfillmentStatus,
        userId,
        userRole,
        `OTP verification failed: ${res.reason}`
      );
    }

    return res.success;
  }

  /**
   * Records a collected specimen sample tube entity.
   */
  async addSample(
    formData: CreateSampleFormData,
    userId: string,
    userRole: AppRole
  ): Promise<Sample> {
    this.assertRole(userRole, MUTATION_ROLES, "add sample container");

    const val = validateSampleCreation(formData);
    if (!val.isValid) {
      throw new Error(`Sample validation failed: ${JSON.stringify(val.errors)}`);
    }

    const id = doc(collection(this.db, "samples")).id;
    const now = serverTimestamp() as unknown as Timestamp;

    const sample: Sample = {
      id,
      fulfillmentId: formData.fulfillmentId,
      barcode: formData.barcode,
      specimenType: formData.specimenType,
      containerType: formData.containerType,
      status: "COLLECTED",
      collectedAt: now,
      processingStatus: "PENDING",
      createdAt: now,
      updatedAt: now,
    };

    await this.sampleRepo.create(sample);

    await this.recordTimelineEvent(
      formData.fulfillmentId,
      TimelineEventType.LABORATORY,
      FulfillmentStatus.SAMPLE_COLLECTED,
      FulfillmentStatus.SAMPLE_COLLECTED,
      userId,
      userRole,
      `Specimen sample barcode ${formData.barcode} (${formData.specimenType} / ${formData.containerType}) collected`
    );

    return sample;
  }

  /**
   * Allocates an internal ProcessingPartner laboratory using PartnerAllocationEngine strategies.
   */
  async allocateProcessingPartner(
    fulfillmentId: string,
    partners: ProcessingPartner[],
    strategyType: AllocationStrategyType,
    userId: string,
    userRole: AppRole
  ): Promise<ProcessingPartner> {
    this.assertRole(userRole, ADMIN_ROLES, "allocate processing partner");

    const existing = await this.repo.getById(fulfillmentId);
    if (!existing) throw new Error(`Fulfillment '${fulfillmentId}' not found`);

    const result = PartnerAllocationEngine.allocate(
      partners,
      existing.pincode ?? "500001",
      strategyType
    );

    const now = serverTimestamp() as unknown as Timestamp;
    const updated: Fulfillment = {
      ...existing,
      assignedPartnerId: result.selectedPartner.id,
      updatedBy: userId,
      updatedAt: now,
    };

    await this.repo.update(updated);

    await this.recordTimelineEvent(
      fulfillmentId,
      TimelineEventType.LABORATORY,
      existing.fulfillmentStatus,
      existing.fulfillmentStatus,
      userId,
      userRole,
      `Allocated to processing partner '${result.selectedPartner.name}' using ${result.strategyUsed} strategy (${result.reason})`
    );

    return result.selectedPartner;
  }

  /**
   * Real-time high-frequency GPS telemetry update.
   */
  async updateTechnicianLocation(
    formData: UpdateTechnicianLocationFormData
  ): Promise<void> {
    const now = serverTimestamp() as unknown as Timestamp;
    await this.locationRepo.updateLocation({
      technicianId: formData.technicianId,
      latitude: formData.latitude,
      longitude: formData.longitude,
      speed: formData.speed,
      batteryLevel: formData.batteryLevel,
      accuracy: formData.accuracy,
      lastUpdated: now,
    });
  }
}
