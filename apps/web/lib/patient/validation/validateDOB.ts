// lib/patient/validation/validateDOB.ts

/**
 * Validates the date of birth string (ISO format).
 * - Must be a valid date.
 * - Must not be in the future.
 */
export function validateDOB(dob: string): string | null {
  if (!dob) return "Date of birth is required";
  const date = new Date(dob);
  if (isNaN(date.getTime())) return "Invalid date format";
  const today = new Date();
  if (date > today) return "Date of birth cannot be in the future";
  return null;
}
