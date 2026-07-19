// Shared enums for Booking module

export enum BookingStatus {
  Pending = "PENDING",
  Confirmed = "CONFIRMED",
  Completed = "COMPLETED",
  Cancelled = "CANCELLED",
}

export enum OrderStatus {
  Draft = "DRAFT",
  Submitted = "SUBMITTED",
  Processed = "PROCESSED",
  Cancelled = "CANCELLED",
}

export enum PaymentStatus {
  Pending = "PENDING",
  Succeeded = "SUCCEEDED",
  Failed = "FAILED",
  Refunded = "REFUNDED",
}

export enum SampleStatus {
  Collected = "COLLECTED",
  Received = "RECEIVED",
  InProcessing = "IN_PROCESSING",
  Completed = "COMPLETED",
  Rejected = "REJECTED",
}
