import { ROUTES } from "./routes";

export const REDIRECTS = {
  // Destination for unauthenticated requests attempting to view secure routes
  UNAUTHENTICATED: ROUTES.LOGIN_PATIENT,
  
  // Destination for access authorization failures (insufficient role permission claims)
  UNAUTHORIZED: ROUTES.HOME,
  
  // Standard post-auth target pathways
  DEFAULT_PATIENT_HOME: ROUTES.HOME,
  DEFAULT_STAFF_DASHBOARD: ROUTES.DASHBOARD,
} as const;
