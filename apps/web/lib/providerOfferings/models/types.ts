// apps/web/lib/providerOfferings/models/types.ts

import { Timestamp } from "firebase/firestore";
import { ProviderOfferingStatus } from "./enums";

/**
 * Pricing configuration for a Provider Offering.
 * Currency defaults to the platform-wide setting (e.g., INR) unless overridden.
 */
export interface PriceConfiguration {
  /** Manufacturer Retail Price (in base currency units, e.g., rupees). */
  mrp: number;
  /** Base selling price – must be non‑negative and <= mrp. */
  sellingPrice: number;
  /** Optional discounted price for members. */
  memberPrice?: number;
  /** Optional promotional price (e.g., limited‑time offer). */
  offerPrice?: number;
  /** Optional currency code to override the global setting (ISO 4217). */
  currencyCode?: string;
}

/**
 * Availability model allowing future extensions such as walk‑in only or online booking.
 */
export interface Availability {
  /** Offering is enabled in the catalogue. */
  enabled: boolean;
  /** Whether the offering can be booked online. */
  onlineBookable: boolean;
}

/**
 * Core Provider Offering entity.
 */
export interface ProviderOffering {
  /** Firestore document ID. */
  id: string;
  /** Schema version for forward compatibility & migration control (defaults to 1). */
  version: number;
  /** Reference to the parent Provider Location. */
  providerLocationId: string;
  /** Reference to the Diagnostic Service from the catalog. */
  diagnosticServiceId: string;
  /** Pricing details for the offering. */
  priceConfiguration: PriceConfiguration;
  /** Current lifecycle status. */
  status: ProviderOfferingStatus;
  /** Availability settings. */
  availability: Availability;
  /** Optional flag indicating home‑collection support (relevant for labs). */
  homeCollectionSupported?: boolean;
  /** Optional override for report turn‑around time (hours). */
  reportTatOverrideHours?: number;
  /** Optional override for procedure duration (minutes). */
  durationOverrideMinutes?: number;
  /** Free‑form notes for internal use. */
  notes?: string;
  /** Admin‑controlled ordering of offerings in UI lists. */
  displayOrder: number;
  /** Provider‑specific display name that can differ from the catalog name. */
  displayNameOverride?: string;
  /** Denormalized provider brand name (snapshot). */
  providerBrandName: string;
  /** Tokenised keywords for full‑text search – generated automatically, not editable. */
  searchKeywords: string[];
  /** Timestamp of the last price configuration change. */
  lastPriceUpdatedAt: Timestamp;
  /** Optional extensible metadata bag for future features. */
  metadata?: Record<string, unknown>;
  /** Auditing fields. */
  createdBy: string;
  updatedBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt?: Timestamp | null;
  deletedBy?: string | null;
}
