// apps/web/lib/providerAvailability/models/enums.ts

/**
 * Service Category defining the domain of healthcare service requested.
 */
export enum ServiceCategory {
  LAB_TEST = "LAB_TEST",
  RADIOLOGY = "RADIOLOGY",
}

/**
 * High-level fulfillment model mapped to each service category.
 * Decouples customer experience from operational fulfillment pipelines.
 */
export enum FulfillmentModel {
  HOME_COLLECTION = "HOME_COLLECTION",
  CENTER_VISIT = "CENTER_VISIT",
  HOME_VISIT = "HOME_VISIT",
  VIDEO_CONSULTATION = "VIDEO_CONSULTATION",
}

/**
 * System-derived booking type reflecting the specific fulfillment strategy.
 * Generated automatically by ServiceBookingPolicyEngine. Never manually selected by users.
 */
export enum BookingType {
  CENTER_VISIT = "CENTER_VISIT",
  HOME_COLLECTION = "HOME_COLLECTION",
  EXPRESS_COLLECTION = "EXPRESS_COLLECTION",
}

/**
 * Standard days of the week.
 */
export enum DayOfWeek {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}
