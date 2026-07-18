/**
 * LabCircle Official Auth Roles Definition
 */

export type Role =
  | "patient"
  | "phlebotomist"
  | "lab_technician" // Maps to lab_staff permissions
  | "lab_staff"
  | "pathologist"
  | "admin"
  | "super_admin";

export const ROLES: Record<string, Role> = {
  PATIENT: "patient",
  PHLEBOTOMIST: "phlebotomist",
  LAB_TECHNICIAN: "lab_technician",
  LAB_STAFF: "lab_staff",
  PATHOLOGIST: "pathologist",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
} as const;
