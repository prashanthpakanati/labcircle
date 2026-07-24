// apps/web/lib/providerOfferings/models/enums.ts

/**
 * Provider Offering lifecycle status.
 * Used throughout the Provider Offering domain to enforce valid state transitions.
 */
export enum ProviderOfferingStatus {
  Draft = "Draft",
  Published = "Published",
  Archived = "Archived",
}

/**
 * Optional version number for optimistic concurrency control.
 * Incremented on each successful update.
 */
export type OfferingVersion = number;
