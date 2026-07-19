// Updated route groups – added SUPER_ADMIN_ROUTES (currently empty) to satisfy middleware utilities
import { ROUTES } from "./routes";

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.ABOUT,
  ROUTES.PRIVACY,
  ROUTES.TERMS,
] as const;

export const GUEST_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.LOGIN_PATIENT,
  ROUTES.LOGIN_STAFF,
  ROUTES.LOGIN_OTP,
] as const;

export const AUTHENTICATED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.PROFILE,
  ROUTES.BOOKINGS,
  ROUTES.REPORTS,
] as const;

export const ADMIN_ROUTES = [ROUTES.ADMIN] as const;
export const LAB_ROUTES = [ROUTES.LAB] as const;

// Super admin routes – currently no dedicated paths, but the constant is required by middleware utils.
export const SUPER_ADMIN_ROUTES = [] as const;
