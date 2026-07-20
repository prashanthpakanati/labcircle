// lib/patient/utils/formatPatientId.ts

/**
 * Formats a numeric id into the display ID format "PAT000001".
 * Expects a number (e.g., 1) or an existing displayId string (returns unchanged).
 */
export function formatPatientId(id: number | string): string {
  if (typeof id === 'string') return id; // assume already formatted
  return `PAT${String(id).padStart(6, '0')}`;
}
