// apps/web/lib/communication/validation/validateCommunication.ts

import { CreateTemplateFormData, PublishEventFormData } from "../models/form";

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<string, string>>;
}

export function validateEventPublish(data: PublishEventFormData): ValidationResult {
  const errors: Partial<Record<string, string>> = {};

  if (!data.eventType?.trim()) errors.eventType = "Event type is required";
  if (!data.sourceDomain?.trim()) errors.sourceDomain = "Source domain is required";
  if (!data.recipientId?.trim()) errors.recipientId = "Recipient ID is required";

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateTemplateCreation(data: CreateTemplateFormData): ValidationResult {
  const errors: Partial<Record<string, string>> = {};

  if (!data.code?.trim()) errors.code = "Template code is required";
  if (!data.name?.trim()) errors.name = "Template name is required";
  if (!data.channel) errors.channel = "Channel is required";
  if (!data.category) errors.category = "Category is required";
  if (!data.bodyTemplate?.trim()) errors.bodyTemplate = "Body template is required";

  return { isValid: Object.keys(errors).length === 0, errors };
}
