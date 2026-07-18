import {
  PUBLIC_ROUTES,
  GUEST_ROUTES,
  AUTHENTICATED_ROUTES,
  ADMIN_ROUTES,
  LAB_ROUTES,
  SUPER_ADMIN_ROUTES,
} from "./route-groups";

/**
 * Checks if a pathname matches public route paths.
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

/**
 * Checks if a pathname matches unauthenticated guest route paths.
 */
export function isGuestRoute(pathname: string): boolean {
  return GUEST_ROUTES.some((route) => pathname === route);
}

/**
 * Checks if a pathname matches role administrator route paths.
 */
export function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

/**
 * Checks if a pathname matches role clinical lab technician route paths.
 */
export function isLabRoute(pathname: string): boolean {
  return LAB_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

/**
 * Checks if a pathname matches super administrator system paths.
 */
export function isSuperAdminRoute(pathname: string): boolean {
  return SUPER_ADMIN_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

/**
 * Checks if a pathname requires authentication.
 */
export function isProtectedRoute(pathname: string): boolean {
  if (isPublicRoute(pathname) || isGuestRoute(pathname)) return false;

  return (
    AUTHENTICATED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`)) ||
    isAdminRoute(pathname) ||
    isLabRoute(pathname) ||
    isSuperAdminRoute(pathname)
  );
}
