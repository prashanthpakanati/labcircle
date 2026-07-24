// apps/web/lib/providerOfferings/validation/validateProviderOffering.ts

import { ProviderOfferingFormData } from "../models/form";
import { ProviderOfferingStatus } from "../models/enums";

/**
 * Validation result returned by all Provider Offering validators.
 */
export interface OfferingValidationResult {
  isValid: boolean;
  errors: Partial<Record<string, string>>;
}

/**
 * Validate the PriceConfiguration portion of an offering form submission.
 * Business rules:
 *  - mrp >= 0
 *  - sellingPrice >= 0 and <= mrp
 *  - memberPrice (if provided) >= 0 and < sellingPrice
 *  - offerPrice (if provided) >= 0 and <= sellingPrice
 */
function validatePriceConfiguration(
  price: ProviderOfferingFormData["priceConfiguration"],
  errors: Partial<Record<string, string>>
): void {
  if (price.mrp === undefined || price.mrp === null) {
    errors["priceConfiguration.mrp"] = "MRP is required";
  } else if (price.mrp < 0) {
    errors["priceConfiguration.mrp"] = "MRP must be 0 or greater";
  }

  if (price.sellingPrice === undefined || price.sellingPrice === null) {
    errors["priceConfiguration.sellingPrice"] = "Selling price is required";
  } else if (price.sellingPrice < 0) {
    errors["priceConfiguration.sellingPrice"] = "Selling price must be 0 or greater";
  } else if (price.mrp !== undefined && price.sellingPrice > price.mrp) {
    errors["priceConfiguration.sellingPrice"] = "Selling price cannot exceed MRP";
  }

  if (price.memberPrice !== undefined && price.memberPrice !== null) {
    if (price.memberPrice < 0) {
      errors["priceConfiguration.memberPrice"] = "Member price must be 0 or greater";
    } else if (price.sellingPrice !== undefined && price.memberPrice >= price.sellingPrice) {
      errors["priceConfiguration.memberPrice"] = "Member price must be less than the selling price";
    }
  }

  if (price.offerPrice !== undefined && price.offerPrice !== null) {
    if (price.offerPrice < 0) {
      errors["priceConfiguration.offerPrice"] = "Offer price must be 0 or greater";
    } else if (price.sellingPrice !== undefined && price.offerPrice > price.sellingPrice) {
      errors["priceConfiguration.offerPrice"] = "Offer price cannot exceed the selling price";
    }
  }
}

/**
 * Validate the Availability portion of an offering form submission.
 * Business rule: if enabled is false, onlineBookable must also be false.
 */
function validateAvailability(
  availability: ProviderOfferingFormData["availability"],
  errors: Partial<Record<string, string>>
): void {
  if (!availability.enabled && availability.onlineBookable) {
    errors["availability.onlineBookable"] =
      "Online booking cannot be enabled when the offering is disabled";
  }
}

/**
 * Validate a full Provider Offering form submission.
 * Returns an OfferingValidationResult with all field‑level errors.
 */
export function validateProviderOffering(
  data: ProviderOfferingFormData
): OfferingValidationResult {
  const errors: Partial<Record<string, string>> = {};

  validatePriceConfiguration(data.priceConfiguration, errors);
  validateAvailability(data.availability, errors);

  if (data.displayOrder === undefined || data.displayOrder === null) {
    errors.displayOrder = "Display order is required";
  } else if (!Number.isInteger(data.displayOrder) || data.displayOrder < 0) {
    errors.displayOrder = "Display order must be a non-negative integer";
  }

  if (
    data.reportTatOverrideHours !== undefined &&
    data.reportTatOverrideHours !== null &&
    data.reportTatOverrideHours < 0
  ) {
    errors.reportTatOverrideHours = "TAT override hours must be 0 or greater";
  }

  if (
    data.durationOverrideMinutes !== undefined &&
    data.durationOverrideMinutes !== null &&
    data.durationOverrideMinutes < 0
  ) {
    errors.durationOverrideMinutes = "Duration override minutes must be 0 or greater";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Status lifecycle transition rules for Provider Offerings.
 * Allowed: Draft → Published, Published → Archived, Archived → Draft.
 */
const ALLOWED_TRANSITIONS: Record<ProviderOfferingStatus, ProviderOfferingStatus[]> = {
  [ProviderOfferingStatus.Draft]: [ProviderOfferingStatus.Published],
  [ProviderOfferingStatus.Published]: [ProviderOfferingStatus.Archived],
  [ProviderOfferingStatus.Archived]: [ProviderOfferingStatus.Draft],
};

/**
 * Check whether a status transition is valid.
 * @returns true if the transition is allowed.
 */
export function isValidStatusTransition(
  from: ProviderOfferingStatus,
  to: ProviderOfferingStatus
): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}
