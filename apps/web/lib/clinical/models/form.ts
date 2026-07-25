// apps/web/lib/clinical/models/form.ts

import { ClinicalObservation } from "./types";
import { ShareType } from "./enums";

export interface CreateReportFormData {
  bookingId: string;
  fulfillmentId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: "MALE" | "FEMALE" | "OTHER";
  serviceCategory: string;
  observations: ClinicalObservation[];
  summaryNotes?: string;
}

export interface ApproveReportFormData {
  reportId: string;
  pathologistId: string;
  pathologistName: string;
  medicalLicenseNumber: string;
  summaryNotes?: string;
}

export interface AmendReportFormData {
  reportId: string;
  observations: ClinicalObservation[];
  amendmentReason: string;
  pathologistId: string;
  pathologistName: string;
}

export interface CreateShareFormData {
  reportId: string;
  patientId: string;
  shareType: ShareType;
  sharedWithEmail?: string;
  expiryHours?: number;
}
