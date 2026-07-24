// apps/web/lib/providerOfferings/models/form.ts

import { ProviderOfferingStatus } from "./enums";

/**
 * Pricing fields used in the create / update form.
 */
export interface PriceConfigurationFormData {
  mrp: number;
  sellingPrice: number;
  memberPrice?: number;
  offerPrice?: number;
  currencyCode?: string;
}

/**
 * Availability fields used in the create / update form.
 */
export interface AvailabilityFormData {
  enabled: boolean;
  onlineBookable: boolean;
}

/**
 * Shape of the form used to create or update a Provider Offering.
 * All IDs are set by the system; this type only contains user‑editable fields.
 */
export interface ProviderOfferingFormData {
  /** Price configuration including MRP and optional tiers. */
  priceConfiguration: PriceConfigurationFormData;
  /** Availability settings. */
  availability: AvailabilityFormData;
  /** Optional home‑collection capability flag. */
  homeCollectionSupported?: boolean;
  /** Optional override for report TAT in hours. */
  reportTatOverrideHours?: number;
  /** Optional override for procedure duration in minutes. */
  durationOverrideMinutes?: number;
  /** Internal notes. */
  notes?: string;
  /** Admin‑controlled display order. */
  displayOrder: number;
  /** Provider‑specific display name override. */
  displayNameOverride?: string;
  /** Status of the offering. */
  status: ProviderOfferingStatus;
}
