// lib/patient/validation/calculateAge.ts

/**
 * Calculates age in years from an ISO date string.
 * Returns a non‑negative integer.
 */
export function calculateAge(dob: string): number {
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return 0;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return Math.max(age, 0);
}
