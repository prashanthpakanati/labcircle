// apps/web/lib/ai/validation/validateAI.ts

import { QueryCopilotFormData, HumanApprovalFormData } from "../models/form";

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<string, string>>;
}

export function validateCopilotQuery(data: QueryCopilotFormData): ValidationResult {
  const errors: Partial<Record<string, string>> = {};

  if (!data.copilotType) errors.copilotType = "Copilot type is required";
  if (!data.prompt?.trim()) errors.prompt = "Prompt query is required";

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateHumanApproval(data: HumanApprovalFormData): ValidationResult {
  const errors: Partial<Record<string, string>> = {};

  if (!data.approvalRequestId?.trim()) errors.approvalRequestId = "Approval request ID is required";
  if (!data.decision) errors.decision = "Decision is required";
  if (!data.reviewerId?.trim()) errors.reviewerId = "Reviewer ID is required";

  return { isValid: Object.keys(errors).length === 0, errors };
}
