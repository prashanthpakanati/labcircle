// lib/shared/validation/generic.ts

/** Simple phone validator – allows digits, optional leading +, length 7‑15 */
export function validatePhone(phone: string): string | null {
  const trimmed = phone?.trim();
  if (!trimmed) return "Phone number is required";
  const phoneRegex = /^\+?\d{7,15}$/;
  return phoneRegex.test(trimmed) ? null : "Invalid phone number format";
}

/** Simple email validator – basic RFC‑5322 pattern */
export function validateEmail(email: string): string | null {
  const trimmed = email?.trim();
  if (!trimmed) return "Email is required";
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return emailRegex.test(trimmed) ? null : "Invalid email format";
}
