// apps/web/lib/fulfillment/models/enums.ts

/**
 * State machine status lifecycle for fulfillment tracking.
 */
export enum FulfillmentStatus {
  BOOKED = "BOOKED",
  FULFILLMENT_CREATED = "FULFILLMENT_CREATED",
  TECHNICIAN_ASSIGNED = "TECHNICIAN_ASSIGNED",
  TECHNICIAN_ACCEPTED = "TECHNICIAN_ACCEPTED",
  TECHNICIAN_EN_ROUTE = "TECHNICIAN_EN_ROUTE",
  ARRIVED = "ARRIVED",
  OTP_VERIFIED = "OTP_VERIFIED",
  SAMPLE_COLLECTED = "SAMPLE_COLLECTED",
  SAMPLE_PACKED = "SAMPLE_PACKED",
  IN_TRANSIT_TO_LAB = "IN_TRANSIT_TO_LAB",
  LAB_RECEIVED = "LAB_RECEIVED",
  PROCESSING = "PROCESSING",
  REPORT_READY = "REPORT_READY",
  COMPLETED = "COMPLETED",
  // Terminal / Exceptional States
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
  NO_SHOW = "NO_SHOW",
  RESCHEDULED = "RESCHEDULED",
}

/**
 * Priority classification for fulfillment tasks.
 */
export enum FulfillmentPriority {
  STANDARD = "STANDARD",
  EXPRESS = "EXPRESS",
  URGENT = "URGENT",
}

/**
 * Status of technician assignment.
 */
export enum AssignmentStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  REASSIGNED = "REASSIGNED",
}

/**
 * Verification state for OTP security domain.
 */
export enum VerificationStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  EXPIRED = "EXPIRED",
  FAILED = "FAILED",
}

/**
 * Specimen types supported by the sample collection engine.
 */
export enum SpecimenType {
  BLOOD = "BLOOD",
  URINE = "URINE",
  STOOL = "STOOL",
  SEMEN = "SEMEN",
  SALIVA = "SALIVA",
  SPUTUM = "SPUTUM",
  SWAB = "SWAB",
  HAIR = "HAIR",
  NAIL = "NAIL",
}

/**
 * Specimen container types.
 */
export enum ContainerType {
  EDTA_TUBE = "EDTA_TUBE",
  SERUM_SEPARATING_TUBE = "SERUM_SEPARATING_TUBE",
  SODIUM_FLUORIDE = "SODIUM_FLUORIDE",
  STERILE_CUP = "STERILE_CUP",
  SWAB_TRANSPORT_MEDIUM = "SWAB_TRANSPORT_MEDIUM",
}

/**
 * Classification of timeline event categories for operational analytics.
 */
export enum TimelineEventType {
  OPERATIONAL = "OPERATIONAL",
  PATIENT = "PATIENT",
  LABORATORY = "LABORATORY",
  NOTIFICATION = "NOTIFICATION",
  SYSTEM = "SYSTEM",
  AUDIT = "AUDIT",
}

/**
 * Generic partner types supported by the platform.
 */
export enum PartnerType {
  LABORATORY = "LABORATORY",
  IMAGING_CENTER = "IMAGING_CENTER",
  ECG_PROVIDER = "ECG_PROVIDER",
  HOME_NURSING = "HOME_NURSING",
  VACCINATION_TEAM = "VACCINATION_TEAM",
  TELEMEDICINE = "TELEMEDICINE",
}

/**
 * Pluggable allocation strategy identifiers.
 */
export enum AllocationStrategyType {
  CAPACITY = "CAPACITY",
  QUALITY = "QUALITY",
  NEAREST = "NEAREST",
  TAT = "TAT",
  HYBRID = "HYBRID",
}

/**
 * Pluggable technician dispatch strategy identifiers.
 */
export enum AssignmentStrategyType {
  NEAREST = "NEAREST",
  LEAST_BUSY = "LEAST_BUSY",
  EXPRESS_PRIORITY = "EXPRESS_PRIORITY",
  ROUND_ROBIN = "ROUND_ROBIN",
  MANUAL = "MANUAL",
}
