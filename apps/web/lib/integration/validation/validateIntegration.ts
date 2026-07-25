// apps/web/lib/integration/validation/validateIntegration.ts

import { CreateAPIClientFormData, RegisterWebhookFormData } from "../models/form";

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<string, string>>;
}

export function validateAPIClientCreation(data: CreateAPIClientFormData): ValidationResult {
  const errors: Partial<Record<string, string>> = {};

  if (!data.clientName?.trim()) errors.clientName = "Client name is required";
  if (!data.clientType) errors.clientType = "Client type is required";
  if (!data.developerId?.trim()) errors.developerId = "Developer ID is required";

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateWebhookRegistration(data: RegisterWebhookFormData): ValidationResult {
  const errors: Partial<Record<string, string>> = {};

  if (!data.developerId?.trim()) errors.developerId = "Developer ID is required";
  if (!data.targetUrl?.trim()) errors.targetUrl = "Target URL is required";
  if (!data.events || data.events.length === 0) errors.events = "At least one event selection is required";

  return { isValid: Object.keys(errors).length === 0, errors };
}
