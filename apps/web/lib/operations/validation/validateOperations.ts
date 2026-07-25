// apps/web/lib/operations/validation/validateOperations.ts

import { CreateExceptionCaseFormData, CreateShiftFormData } from "../models/form";

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<string, string>>;
}

export function validateExceptionCase(data: CreateExceptionCaseFormData): ValidationResult {
  const errors: Partial<Record<string, string>> = {};

  if (!data.fulfillmentId?.trim()) errors.fulfillmentId = "Fulfillment ID is required";
  if (!data.type) errors.type = "Exception type is required";
  if (!data.severity) errors.severity = "Severity is required";
  if (!data.title?.trim()) errors.title = "Title is required";
  if (!data.description?.trim()) errors.description = "Description is required";

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateShiftCreation(data: CreateShiftFormData): ValidationResult {
  const errors: Partial<Record<string, string>> = {};

  if (!data.technicianId?.trim()) errors.technicianId = "Technician ID is required";
  if (!data.date?.trim()) errors.date = "Date is required";
  if (!data.startTime?.trim()) errors.startTime = "Start time is required";
  if (!data.endTime?.trim()) errors.endTime = "End time is required";
  if (!data.assignedPincodes || data.assignedPincodes.length === 0) {
    errors.assignedPincodes = "At least one pincode must be assigned";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
