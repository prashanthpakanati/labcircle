// apps/web/lib/communication/models/enums.ts

export enum CommunicationChannel {
  SMS = "SMS",
  WHATSAPP = "WHATSAPP",
  EMAIL = "EMAIL",
  PUSH = "PUSH",
  IN_APP = "IN_APP",
}

export enum CommunicationPriority {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum CommunicationStatus {
  QUEUED = "QUEUED",
  PROCESSING = "PROCESSING",
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  READ = "READ",
  FAILED = "FAILED",
}

export enum TemplateStatus {
  DRAFT = "DRAFT",
  UNDER_REVIEW = "UNDER_REVIEW",
  APPROVED = "APPROVED",
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
}

export enum CampaignStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum ReminderStatus {
  SCHEDULED = "SCHEDULED",
  SENT = "SENT",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}

export enum NotificationCategory {
  BOOKING = "BOOKING",
  FULFILLMENT = "FULFILLMENT",
  OPERATIONS = "OPERATIONS",
  CLINICAL = "CLINICAL",
  COMMERCE = "COMMERCE",
  PROMOTIONAL = "PROMOTIONAL",
}

export enum ConsentStatus {
  OPTED_IN = "OPTED_IN",
  OPTED_OUT = "OPTED_OUT",
}
