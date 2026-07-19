// Domain models for Booking module

import { BookingStatus, OrderStatus, PaymentStatus, SampleStatus } from "./enums";

export interface PatientReference {
  id: string; // Firestore document ID of the patient
  name: string;
  email: string;
}

export interface Order {
  id: string;
  patientId: string;
  status: OrderStatus;
  createdAt: string; // ISO timestamp
  updatedAt: string;
  // optional list of test IDs (referencing catalog)
  testIds?: string[];
}

export interface Appointment {
  id: string;
  orderId: string;
  patientId: string;
  status: BookingStatus;
  scheduledAt: string; // ISO timestamp
  // optional fields for location or virtual link
  location?: string;
  virtualLink?: string;
}

export interface Sample {
  id: string;
  appointmentId: string;
  status: SampleStatus;
  barcode?: string;
  type?: string; // e.g., "blood", "saliva"
  container?: string;
  collectedAt?: string;
  receivedAt?: string;
  temperatureC?: number;
  rejectionReason?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amountCents: number;
  currency: string;
  status: PaymentStatus;
  method: string; // e.g., "card", "insurance"
  createdAt: string;
}

export interface Report {
  id: string;
  orderId: string;
  version: number;
  createdAt: string;
  // URL to the stored PDF/HTML report in Cloud Storage
  fileUrl: string;
  // optional AI insights placeholder
  aiInsights?: Record<string, unknown>;
}

export interface CatalogItem {
  id: string;
  name: string;
  description?: string;
  priceCents: number;
  // type can be "test", "package", "addon"
  type: string;
}

// Export a union type for any Booking‑module entity if needed
export type BookingEntity =
  | Order
  | Appointment
  | Sample
  | Payment
  | Report
  | CatalogItem;
