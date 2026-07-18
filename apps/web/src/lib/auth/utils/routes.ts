export const PUBLIC_ROUTES = ["/", "/about", "/privacy", "/terms"] as const;

export const GUEST_ROUTES = [
  "/login",
  "/login/patient",
  "/login/staff",
  "/login/otp",
] as const;

export const AUTHENTICATED_ROUTES = [
  "/dashboard",
  "/profile",
  "/bookings",
  "/reports",
] as const;

export const ADMIN_ROUTES = ["/admin"] as const;
export const LAB_ROUTES = ["/lab"] as const;
export const SUPER_ADMIN_ROUTES = ["/system"] as const;

/**
 * Checks if a pathname is a public route.
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

/**
 * Checks if a pathname is restricted to unauthenticated guests.
 */
export function isGuestRoute(pathname: string): boolean {
  return GUEST_ROUTES.some((route) => pathname === route);
}

/**
 * Checks if a pathname requires standard authentication.
 */
export function isProtectedRoute(pathname: string): boolean {
  // If it's explicitly public or guest, it's not protected
  if (isPublicRoute(pathname) || isGuestRoute(pathname)) return false;

  return (
    AUTHENTICATED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`)) ||
    isAdminRoute(pathname) ||
    isLabRoute(pathname) ||
    isSuperAdminRoute(pathname)
  );
}

/**
 * Checks if a pathname is restricted to administrators.
 */
export function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

/**
 * Checks if a pathname is restricted to lab staff/technicians.
 */
export function isLabRoute(pathname: string): boolean {
  return LAB_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

/**
 * Checks if a pathname is restricted to super administrators.
 */
export function isSuperAdminRoute(pathname: string): boolean {
  return SUPER_ADMIN_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}
