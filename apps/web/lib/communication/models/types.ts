// apps/web/lib/communication/models/types.ts

import { Timestamp } from "firebase/firestore";
import {
  CommunicationChannel,
  CommunicationPriority,
  CommunicationStatus,
  TemplateStatus,
  NotificationCategory,
  ConsentStatus,
} from "./enums";

export interface CommunicationEvent {
  id: string;
  eventType: string; // e.g. "BookingConfirmed", "ReportReady", "PaymentCaptured"
  sourceDomain: string;
  recipientId: string;
  recipientEmail?: string;
  recipientPhone?: string;
  payload: Record<string, unknown>;
  timestamp: Timestamp;
}

export interface CommunicationRequest {
  id: string;
  eventId?: string;
  recipientId: string;
  recipientContact: string;
  channel: CommunicationChannel;
  priority: CommunicationPriority;
  templateCode: string;
  variables: Record<string, string>;
  status: CommunicationStatus;
  retryCount: number;
  maxRetries: number;
  fallbackChannel?: CommunicationChannel | null;
  createdAt: Timestamp;
}

export interface CommunicationResult {
  requestId: string;
  providerName: string;
  providerMessageId: string;
  status: CommunicationStatus;
  deliveredAt?: Timestamp | null;
  error?: string | null;
}

export interface NotificationTemplate {
  id: string;
  code: string;
  name: string;
  channel: CommunicationChannel;
  category: NotificationCategory;
  subjectTemplate?: string;
  bodyTemplate: string;
  version: number;
  status: TemplateStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface NotificationPreference {
  userId: string;
  smsConsent: ConsentStatus;
  whatsappConsent: ConsentStatus;
  emailConsent: ConsentStatus;
  pushConsent: ConsentStatus;
  quietHoursStart?: string | null; // HH:mm format e.g. "22:00"
  quietHoursEnd?: string | null;   // HH:mm format e.g. "07:00"
  updatedAt: Timestamp;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: NotificationCategory;
  isRead: boolean;
  isPinned: boolean;
  deepLink?: string | null;
  createdAt: Timestamp;
}

export interface CommunicationAuditRecord {
  id: string;
  requestId: string;
  channel: CommunicationChannel;
  provider: string;
  recipient: string;
  payloadHash: string;
  status: CommunicationStatus;
  retryHistory: { attempt: number; timestamp: Timestamp; error?: string }[];
  timestamp: Timestamp;
}
