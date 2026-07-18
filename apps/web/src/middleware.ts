import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isGuestRoute,
  isProtectedRoute,
  isAdminRoute,
  isLabRoute,
  isSuperAdminRoute,
} from "./lib/routing/middleware-utils";
import { REDIRECTS } from "./lib/routing/redirects";

// Decodes JWT token payload from client cookies without cryptographic overhead
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve session token from cookie
  const sessionToken = request.cookies.get("__session")?.value;
  const payload = sessionToken ? decodeJwtPayload(sessionToken) : null;
  const userRole = payload?.role || null;

  const isAuthenticated = !!payload;

  // 1. Authenticated users attempting to view Guest Pages (Login panels)
  if (isAuthenticated && isGuestRoute(pathname)) {
    // Redirect patients to home, and admin/clinical staff to dashboard
    const destination = userRole === "patient" ? REDIRECTS.DEFAULT_PATIENT_HOME : REDIRECTS.DEFAULT_STAFF_DASHBOARD;
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // 2. Unauthenticated users attempting to view Protected Pages
  if (!isAuthenticated && isProtectedRoute(pathname)) {
    // Redirect to patient login portal, retaining original request url
    const loginUrl = new URL(REDIRECTS.UNAUTHENTICATED, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Authenticated role-based access checks (Central Authorization checks)
  if (isAuthenticated && isProtectedRoute(pathname)) {
    // Admin dashboard guards
    if (isAdminRoute(pathname) && userRole !== "admin" && userRole !== "super_admin") {
      return NextResponse.redirect(new URL(REDIRECTS.UNAUTHORIZED, request.url));
    }

    // Laboratory desk guards
    if (
      isLabRoute(pathname) &&
      userRole !== "lab_staff" &&
      userRole !== "lab_technician" &&
      userRole !== "admin" &&
      userRole !== "super_admin"
    ) {
      return NextResponse.redirect(new URL(REDIRECTS.UNAUTHORIZED, request.url));
    }

    // Super Admin system panel guards
    if (isSuperAdminRoute(pathname) && userRole !== "super_admin") {
      return NextResponse.redirect(new URL(REDIRECTS.UNAUTHORIZED, request.url));
    }
  }

  return NextResponse.next();
}

// Next.js middleware matchers to optimize pipeline execution
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public brand image folders)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
