// apps/web/lib/clinical/validation/validateClinicalReport.ts

import { CreateReportFormData, ApproveReportFormData } from "../models/form";

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<string, string>>;
}

export function validateReportCreation(data: CreateReportFormData): ValidationResult {
  const errors: Partial<Record<string, string>> = {};

  if (!data.bookingId?.trim()) errors.bookingId = "Booking ID is required";
  if (!data.fulfillmentId?.trim()) errors.fulfillmentId = "Fulfillment ID is required";
  if (!data.patientId?.trim()) errors.patientId = "Patient ID is required";
  if (!data.patientName?.trim()) errors.patientName = "Patient name is required";
  if (!data.observations || data.observations.length === 0) {
    errors.observations = "Report must contain at least one clinical observation";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validatePathologistApproval(data: ApproveReportFormData): ValidationResult {
  const errors: Partial<Record<string, string>> = {};

  if (!data.reportId?.trim()) errors.reportId = "Report ID is required";
  if (!data.pathologistId?.trim()) errors.pathologistId = "Pathologist ID is required";
  if (!data.medicalLicenseNumber?.trim()) errors.medicalLicenseNumber = "Medical license number is required";

  return { isValid: Object.keys(errors).length === 0, errors };
}
