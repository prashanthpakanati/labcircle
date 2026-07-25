// apps/web/lib/commerce/validation/validateCommerce.ts

import { ProcessPaymentFormData, WalletTopupFormData } from "../models/form";

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<string, string>>;
}

export function validatePaymentProcess(data: ProcessPaymentFormData): ValidationResult {
  const errors: Partial<Record<string, string>> = {};

  if (!data.bookingId?.trim()) errors.bookingId = "Booking ID is required";
  if (!data.patientId?.trim()) errors.patientId = "Patient ID is required";
  if (!data.amount || data.amount <= 0) errors.amount = "Payment amount must be greater than zero";
  if (!data.paymentMethod) errors.paymentMethod = "Payment method is required";

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateWalletTopup(data: WalletTopupFormData): ValidationResult {
  const errors: Partial<Record<string, string>> = {};

  if (!data.patientId?.trim()) errors.patientId = "Patient ID is required";
  if (!data.amount || data.amount <= 0) errors.amount = "Topup amount must be greater than zero";

  return { isValid: Object.keys(errors).length === 0, errors };
}
