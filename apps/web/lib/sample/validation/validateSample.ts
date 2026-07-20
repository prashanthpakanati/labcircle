// apps/web/lib/sample/validation/validateSample.ts

import { SampleFormData } from "../models/form";
import { CollectionType, CollectorType, SampleStatus } from "../models/enums";
import { canTransition, getAllowedTransitions } from "../utils/workflow";

export interface SampleValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof SampleFormData | "items", string>>;
}

/**
 * Validates all required fields for creating or updating a Sample.
 *
 * Rules enforced:
 *  - orderId must be a non-empty string (valid order reference)
 *  - patientId must be a non-empty string (valid patient reference)
 *  - collectionType must be a known CollectionType value
 *  - collectorType must be a known CollectorType value
 *  - collectorId must be non-empty
 *  - items must contain at least one SampleItem
 *  - Each item must have testId, testName, testCode, sampleType, containerType
 *  - If collectedAt is provided it must be a valid ISO timestamp
 */
export function validateSample(data: SampleFormData): SampleValidationResult {
  const errors: Partial<Record<keyof SampleFormData | "items", string>> = {};

  // ─── orderId ───────────────────────────────────────────────────────────────
  if (!data.orderId?.trim()) {
    errors.orderId = "A valid order reference is required";
  }

  // ─── patientId ─────────────────────────────────────────────────────────────
  if (!data.patientId?.trim()) {
    errors.patientId = "A valid patient reference is required";
  }

  // ─── collectionType ────────────────────────────────────────────────────────
  if (!data.collectionType) {
    errors.collectionType = "Collection type is required";
  } else if (!Object.values(CollectionType).includes(data.collectionType)) {
    errors.collectionType = "Invalid collection type";
  }

  // ─── collectorType ─────────────────────────────────────────────────────────
  if (!data.collectorType) {
    errors.collectorType = "Collector type is required";
  } else if (!Object.values(CollectorType).includes(data.collectorType)) {
    errors.collectorType = "Invalid collector type";
  }

  // ─── collectorId ───────────────────────────────────────────────────────────
  if (!data.collectorId?.trim()) {
    errors.collectorId = "Collector ID is required";
  }

  // ─── items ─────────────────────────────────────────────────────────────────
  if (!data.items || data.items.length === 0) {
    errors.items = "At least one sample item is required";
  } else {
    const hasInvalidItem = data.items.some(
      (item) =>
        !item.testId?.trim() ||
        !item.testName?.trim() ||
        !item.testCode?.trim() ||
        !item.sampleType?.trim() ||
        !item.containerType?.trim()
    );
    if (hasInvalidItem) {
      errors.items =
        "All sample items must have testId, testName, testCode, sampleType, and containerType";
    }
  }

  // ─── collectedAt (if provided, must be a valid date) ──────────────────────
  if (data.collectedAt !== undefined && data.collectedAt !== null) {
    const parsed = new Date(data.collectedAt);
    if (isNaN(parsed.getTime())) {
      errors.collectedAt = "collectedAt must be a valid ISO timestamp";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// ─── Status transition guard ─────────────────────────────────────────────────

export { canTransition, getAllowedTransitions };

/**
 * Returns true if transitioning from `current` to `next` is a valid
 * status progression.
 */
export function isValidStatusTransition(
  current: SampleStatus,
  next: SampleStatus
): boolean {
  return canTransition(current, next);
}
