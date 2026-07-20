// apps/web/lib/test/validation/validateTest.ts

import { TestFormData } from "../models/form";
import { TestDepartment, TestCategory } from "../models/enums";

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof TestFormData, string>>;
}

/**
 * Runs all field-level validators for TestFormData and returns consolidated result.
 */
export function validateTest(data: TestFormData): ValidationResult {
  const errors: Partial<Record<keyof TestFormData, string>> = {};

  if (!data.name?.trim()) {
    errors.name = "Test name is required";
  }

  if (!data.code?.trim()) {
    errors.code = "Test code is required";
  } else if (!/^[A-Z0-9_-]{2,15}$/i.test(data.code.trim())) {
    errors.code = "Test code must be 2-15 alphanumeric characters";
  }

  if (!data.department) {
    errors.department = "Department is required";
  } else if (!Object.values(TestDepartment).includes(data.department)) {
    errors.department = "Invalid department selected";
  }

  if (!data.category) {
    errors.category = "Category is required";
  } else if (!Object.values(TestCategory).includes(data.category)) {
    errors.category = "Invalid category selected";
  }

  if (!data.specimenType?.trim()) {
    errors.specimenType = "Specimen type is required";
  }

  if (!data.method?.trim()) {
    errors.method = "Method is required";
  }

  if (data.tatHours === undefined || data.tatHours === null) {
    errors.tatHours = "TAT hours is required";
  } else if (typeof data.tatHours !== "number" || isNaN(data.tatHours) || data.tatHours < 0) {
    errors.tatHours = "TAT hours must be a non-negative number";
  }

  if (data.urgentTatHours === undefined || data.urgentTatHours === null) {
    errors.urgentTatHours = "Urgent TAT hours is required";
  } else if (typeof data.urgentTatHours !== "number" || isNaN(data.urgentTatHours) || data.urgentTatHours < 0) {
    errors.urgentTatHours = "Urgent TAT hours must be a non-negative number";
  } else if (data.urgentTatHours > (data.tatHours ?? 0)) {
    errors.urgentTatHours = "Urgent TAT cannot exceed routine TAT";
  }

  if (data.mrp === undefined || data.mrp === null) {
    errors.mrp = "MRP is required";
  } else if (typeof data.mrp !== "number" || isNaN(data.mrp) || data.mrp < 0) {
    errors.mrp = "MRP must be a non-negative number";
  }

  if (data.b2bPrice === undefined || data.b2bPrice === null) {
    errors.b2bPrice = "B2B Price is required";
  } else if (typeof data.b2bPrice !== "number" || isNaN(data.b2bPrice) || data.b2bPrice < 0) {
    errors.b2bPrice = "B2B Price must be a non-negative number";
  } else if (data.b2bPrice > (data.mrp ?? 0)) {
    errors.b2bPrice = "B2B Price cannot exceed MRP";
  }

  if (data.labCirclePrice === undefined || data.labCirclePrice === null) {
    errors.labCirclePrice = "LabCircle Price is required";
  } else if (typeof data.labCirclePrice !== "number" || isNaN(data.labCirclePrice) || data.labCirclePrice < 0) {
    errors.labCirclePrice = "LabCircle Price must be a non-negative number";
  } else if (data.labCirclePrice > (data.mrp ?? 0)) {
    errors.labCirclePrice = "LabCircle Price cannot exceed MRP";
  }

  if (data.homeCollection === undefined || data.homeCollection === null) {
    errors.homeCollection = "Home collection preference is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
