// apps/web/lib/imaging/validation/validateCategory.ts

import { CatalogStatus } from "../models/enums";
import { CategoryFormData } from "../models/form";

export interface CategoryValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof CategoryFormData, string>>;
}

/**
 * Runs validation checks for CategoryFormData.
 */
export function validateCategory(data: CategoryFormData): CategoryValidationResult {
  const errors: Partial<Record<keyof CategoryFormData, string>> = {};

  if (!data.name?.trim()) {
    errors.name = "Category name is required";
  }

  if (!data.code?.trim()) {
    errors.code = "Category code is required";
  } else if (!/^[A-Z0-9_-]{2,20}$/i.test(data.code.trim())) {
    errors.code = "Category code must be 2-20 alphanumeric characters, dashes, or underscores";
  }

  if (data.displayOrder === undefined || data.displayOrder === null || typeof data.displayOrder !== "number" || isNaN(data.displayOrder)) {
    errors.displayOrder = "Display order must be a valid number";
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
