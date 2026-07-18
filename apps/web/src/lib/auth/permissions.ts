/**
 * LabCircle Official PBAC Permissions Definition
 */

export const PERMISSIONS = {
  // Booking operations
  BOOKING_CREATE: "booking.create",
  BOOKING_VIEW: "booking.view",
  BOOKING_MANAGE: "booking.manage",

  // Reports and Diagnostic records
  REPORTS_VIEW: "reports.view",
  REPORTS_UPLOAD: "reports.upload",
  REPORTS_REVIEW: "reports.review",
  REPORTS_SIGN: "reports.sign",
  REPORTS_PUBLISH: "reports.publish",
  REPORTS_MANAGE: "reports.manage",

  // Profile operations
  PROFILE_EDIT: "profile.edit",

  // Sample management
  SAMPLE_COLLECT: "sample.collect",
  SAMPLE_UPDATE: "sample.update",
  SAMPLE_MANAGE: "sample.manage",

  // Administrative actions
  USERS_MANAGE: "users.manage",
  USERS_DELETE: "users.delete",
  LABS_MANAGE: "labs.manage",
  BILLING_MANAGE: "billing.manage",

  // Future feature-flags placeholders
  MEMBERSHIP_MANAGE: "membership.manage",
  CORPORATE_MANAGE: "corporate.manage",
  HOMECARE_MANAGE: "homecare.manage",
  TELEMEDICINE_MANAGE: "telemedicine.manage",
  ECG_SCHEDULE: "ecg.schedule",
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS] | "*";
