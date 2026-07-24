// apps/web/lib/imaging/validation/validateService.ts

import { CatalogStatus } from "../models/enums";
import { ServiceFormData } from "../models/form";

export interface ServiceValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof ServiceFormData, string>>;
}

/**
 * Runs validation checks for ServiceFormData.
 */
export function validateService(data: ServiceFormData): ServiceValidationResult {
  const errors: Partial<Record<keyof ServiceFormData, string>> = {};

  if (!data.categoryId) {
    errors.categoryId = "Category selection is required";
  }

  if (!data.serviceName?.trim()) {
    errors.serviceName = "Service name is required";
  }

  if (!data.slug?.trim()) {
    errors.slug = "Slug is required";
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug.trim())) {
    errors.slug = "Slug must be lowercase alphanumeric characters separated by dashes (kebab-case)";
  }

  if (!data.serviceCode?.trim()) {
    errors.serviceCode = "Service code is required";
  } else if (!/^[A-Z0-9_-]{2,30}$/i.test(data.serviceCode.trim())) {
    errors.serviceCode = "Service code must be 2-30 alphanumeric characters, dashes, or underscores";
  }

  if (!data.modality?.trim()) {
    errors.modality = "Modality is required";
  }

  if (!data.bodyPart?.trim()) {
    errors.bodyPart = "Body part target is required";
  }

  if (data.durationMinutes === undefined || data.durationMinutes === null) {
    errors.durationMinutes = "Scan duration is required";
  } else if (typeof data.durationMinutes !== "number" || isNaN(data.durationMinutes) || data.durationMinutes <= 0) {
    errors.durationMinutes = "Scan duration must be a positive number of minutes";
  }

  if (data.reportTatHours === undefined || data.reportTatHours === null) {
    errors.reportTatHours = "Report turnaround hours is required";
  } else if (typeof data.reportTatHours !== "number" || isNaN(data.reportTatHours) || data.reportTatHours <= 0) {
    errors.reportTatHours = "Turnaround hours must be a positive number";
  }

  if (!data.status) {
    errors.status = "Status is required";
  } else if (!Object.values(CatalogStatus).includes(data.status)) {
    errors.status = "Invalid status selected";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
