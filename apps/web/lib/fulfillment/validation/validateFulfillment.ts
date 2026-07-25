// apps/web/lib/fulfillment/validation/validateFulfillment.ts

import { CreateSampleFormData } from "../models/form";

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<string, string>>;
}

export function validateSampleCreation(data: CreateSampleFormData): ValidationResult {
  const errors: Partial<Record<string, string>> = {};

  if (!data.fulfillmentId?.trim()) {
    errors.fulfillmentId = "fulfillmentId is required";
  }

  if (!data.barcode?.trim()) {
    errors.barcode = "Sample barcode is required";
  } else if (!/^[A-Z0-9_-]{6,30}$/i.test(data.barcode.trim())) {
    errors.barcode = "Barcode must be 6-30 alphanumeric characters";
  }

  if (!data.specimenType) {
    errors.specimenType = "Specimen type is required";
  }

  if (!data.containerType) {
    errors.containerType = "Container type is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
