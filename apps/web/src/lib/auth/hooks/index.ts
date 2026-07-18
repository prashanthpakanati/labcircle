"use client";

import { useAuthContext } from "../providers/auth-provider";
import { AuthenticatedUser } from "../types";
import { Role } from "../roles";
import { Permission } from "../permissions";

/**
 * Access the core authentication context containing user, loading, and error states.
 */
export function useAuth() {
  return useAuthContext();
}

/**
 * Get the current logged-in user profile, if authenticated.
 */
export function useCurrentUser(): AuthenticatedUser | null {
  const { user } = useAuthContext();
  return user;
}

/**
 * Get the Role of the current user session.
 */
export function useCurrentRole(): Role | null {
  const { user } = useAuthContext();
  return user ? user.role : null;
}

/**
 * Get the list of active PBAC permissions granted to the current user.
 */
export function usePermissions(): Permission[] {
  const { user } = useAuthContext();
  return user ? user.permissions : [];
}

/**
 * Helper checking if the user session has finished loading and is verified.
 */
export function useIsAuthenticated(): boolean {
  const { user, loading } = useAuthContext();
  return !loading && user !== null;
}
