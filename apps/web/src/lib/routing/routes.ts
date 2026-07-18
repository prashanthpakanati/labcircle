/**
 * LabCircle Central Route Paths Constants
 */

export const ROUTES = {
  // Public routes
  HOME: "/",
  ABOUT: "/about",
  PRIVACY: "/privacy",
  TERMS: "/terms",

  // Guest-only routes
  LOGIN: "/login",
  LOGIN_PATIENT: "/login/patient",
  LOGIN_STAFF: "/login/staff",
  LOGIN_OTP: "/login/otp",

  // Protected portal routes
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  BOOKINGS: "/bookings",
  REPORTS: "/reports",

  // Role restricted modules
  ADMIN: "/admin",
  LAB: "/lab",
  SYSTEM: "/system",
  
  // Error fallback targets
  UNAUTHORIZED: "/unauthorized",
} as const;
