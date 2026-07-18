import { Role } from "./roles";
import { Permission } from "./permissions";

export interface UserAuthDetails {
  role: string | null;
  [key: string]: unknown; // Allow extensibility of user fields
}

// Role-to-Permission Mapping
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  patient: [
    "booking.create",
    "booking.view",
    "reports.view",
    "profile.edit",
  ],

  phlebotomist: [
    "sample.collect",
    "sample.update",
    "booking.view",
  ],

  lab_staff: [
    "booking.manage",
    "sample.manage",
    "reports.upload",
  ],

  lab_technician: [
    // Maps to identical permissions as lab_staff for client schema compatibility
    "booking.manage",
    "sample.manage",
    "reports.upload",
  ],

  pathologist: [
    "reports.review",
    "reports.sign",
    "reports.publish",
  ],

  admin: [
    "users.manage",
    "labs.manage",
    "billing.manage",
    "reports.manage",
  ],

  super_admin: [
    "*", // Wildcard grant for all permissions
  ],
};

/**
 * Checks if a user has a specific permission based on their assigned role.
 */
export function can(user: UserAuthDetails | null | undefined, permission: Permission): boolean {
  if (!user || !user.role) return false;

  const userRole = user.role.toLowerCase() as Role;
  const permissions = ROLE_PERMISSIONS[userRole];

  if (!permissions) return false;

  // Wildcard check
  if (permissions.includes("*")) return true;

  return permissions.includes(permission);
}

/**
 * Asserts whether a user has a specific role.
 */
export function hasRole(user: UserAuthDetails | null | undefined, role: Role): boolean {
  if (!user || !user.role) return false;
  return user.role.toLowerCase() === role.toLowerCase();
}

/**
 * Checks if a user has at least one of the specified permissions.
 */
export function hasAnyPermission(
  user: UserAuthDetails | null | undefined,
  permissions: Permission[]
): boolean {
  if (!user || !user.role) return false;
  return permissions.some((permission) => can(user, permission));
}

/**
 * Checks if a user holds all of the specified permissions.
 */
export function hasAllPermissions(
  user: UserAuthDetails | null | undefined,
  permissions: Permission[]
): boolean {
  if (!user || !user.role) return false;
  return permissions.every((permission) => can(user, permission));
}
