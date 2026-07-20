// lib/shared/formatting/date.ts

/**
 * Format a Date or ISO string as "DD MMM YYYY" (e.g., "05 Sep 2024").
 */
export function formatDate(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "";
  // Use en-GB locale for day month year order and short month names.
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format a Date or ISO string as "DD MMM YYYY HH:mm" (24‑hour time omitted for simplicity).
 */
export function formatDateTime(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "";
  const datePart = formatDate(date);
  const timePart = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${datePart} ${timePart}`;
}
