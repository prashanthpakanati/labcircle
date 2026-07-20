// apps/web/lib/order/validation/validateOrder.ts

import { OrderFormData } from "../models/form";
import { OrderCollectionType } from "../models/enums";

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof OrderFormData | "items", string>>;
}

/**
 * Runs field-level validators for OrderFormData and returns consolidated result.
 */
export function validateOrder(data: OrderFormData): ValidationResult {
  const errors: Partial<Record<keyof OrderFormData | "items", string>> = {};

  if (!data.patientId?.trim()) {
    errors.patientId = "Patient is required";
  }

  if (!data.collectionType) {
    errors.collectionType = "Collection type is required";
  } else if (!Object.values(OrderCollectionType).includes(data.collectionType)) {
    errors.collectionType = "Invalid collection type selected";
  }

  if (!Array.isArray(data.items) || data.items.length === 0) {
    errors.items = "Order must contain at least one test item";
  } else {
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      if (!item.testId?.trim() || !item.testName?.trim() || !item.testCode?.trim()) {
        errors.items = `Item at index ${i} is missing required test metadata`;
        break;
      }
      if (typeof item.priceCharged !== "number" || isNaN(item.priceCharged) || item.priceCharged < 0) {
        errors.items = `Item "${item.testName}" must have a non-negative price`;
        break;
      }
      if (typeof item.quantity !== "number" || isNaN(item.quantity) || item.quantity < 1) {
        errors.items = `Item "${item.testName}" quantity must be at least 1`;
        break;
      }
    }
  }

  if (data.discount === undefined || data.discount === null) {
    errors.discount = "Discount is required";
  } else if (typeof data.discount !== "number" || isNaN(data.discount) || data.discount < 0) {
    errors.discount = "Discount must be a non-negative number";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
