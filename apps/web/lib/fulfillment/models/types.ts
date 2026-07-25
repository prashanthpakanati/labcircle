// apps/web/lib/fulfillment/models/types.ts

import { Timestamp } from "firebase/firestore";
import {
  FulfillmentStatus,
  FulfillmentPriority,
  AssignmentStatus,
  VerificationStatus,
  SpecimenType,
  ContainerType,
  TimelineEventType,
  PartnerType,
  AllocationStrategyType,
  AssignmentStrategyType,
} from "./enums";

/**
 * Core Operational Fulfillment Entity.
 */
export interface Fulfillment {
  id: string;
  version: number;
  bookingId: string;
  serviceCategory: string;
  fulfillmentStatus: FulfillmentStatus;
  assignedTechnicianId?: string | null;
  assignedPartnerId?: string | null;
  priority: FulfillmentPriority;
  pincode?: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  updatedBy: string;
  deletedAt?: Timestamp | null;
  deletedBy?: string | null;
}

/**
 * Immutable Timeline Event Document.
 */
export interface FulfillmentTimelineEvent {
  id: string;
  fulfillmentId: string;
  eventType: TimelineEventType;
  previousStatus: FulfillmentStatus;
  currentStatus: FulfillmentStatus;
  performedBy: string;
  performedByRole: string;
  timestamp: Timestamp;
  notes?: string;
  location?: { latitude: number; longitude: number } | null;
}

/**
 * Collection Verification OTP Security Domain.
 */
export interface CollectionVerification {
  id: string;
  fulfillmentId: string;
  otpHash: string; // SHA-256 hash (never plaintext)
  expiresAt: Timestamp;
  verifiedAt?: Timestamp | null;
  attemptCount: number;
  maxAttempts: number;
  status: VerificationStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * First-Class Specimen Sample Entity.
 */
export interface Sample {
  id: string;
  fulfillmentId: string;
  barcode: string;
  specimenType: SpecimenType;
  containerType: ContainerType;
  status: string;
  collectedAt: Timestamp;
  receivedAtPartnerAt?: Timestamp | null;
  processingStatus: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Technician / Phlebotomist Assignment Record.
 */
export interface TechnicianAssignment {
  id: string;
  fulfillmentId: string;
  technicianId: string;
  strategyUsed: AssignmentStrategyType;
  status: AssignmentStatus;
  assignedAt: Timestamp;
  respondedAt?: Timestamp | null;
}

/**
 * Real-Time Technician Telemetry & Location Document.
 */
export interface TechnicianLocation {
  technicianId: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  batteryLevel?: number;
  accuracy?: number;
  lastUpdated: Timestamp;
}

/**
 * Generic Processing Partner Entity (Laboratory, Imaging Center, ECG Provider, etc.).
 */
export interface ProcessingPartner {
  id: string;
  name: string;
  code: string;
  partnerType: PartnerType;
  accreditations: string[];
  serviceablePincodes: string[];
  dailyCapacity: number;
  currentLoad: number;
  avgTurnaroundHours: number;
  qualityScore: number; // 0-100 rating score
  location?: { latitude: number; longitude: number } | null;
  isActive: boolean;
}

/**
 * Partner Allocation Record.
 */
export interface PartnerAllocation {
  id: string;
  fulfillmentId: string;
  allocatedPartnerId: string;
  partnerType: PartnerType;
  strategyUsed: AllocationStrategyType;
  score: number;
  reason: string;
  allocatedAt: Timestamp;
}

/**
 * Sample Logistics & Cold-Chain Tracking Document.
 */
export interface SampleLogistics {
  id: string;
  sampleId: string;
  temperatureStatus: "NORMAL" | "EXCURSION_LOW" | "EXCURSION_HIGH";
  currentTemperatureCelsius?: number;
  inTransitAt: Timestamp;
  receivedAtPartnerAt?: Timestamp | null;
}
