// apps/web/lib/ai/models/form.ts

import { AIProvider } from "./enums";

export interface QueryCopilotFormData {
  copilotType: "PATIENT" | "OPERATIONS" | "CLINICAL" | "FINANCE";
  prompt: string;
  sessionId?: string;
  provider?: AIProvider;
}

export interface CreatePromptFormData {
  code: string;
  name: string;
  category: string;
  templateBody: string;
}

export interface HumanApprovalFormData {
  approvalRequestId: string;
  decision: "APPROVED" | "REJECTED";
  reviewerId: string;
  reviewerRole: string;
  comments: string;
}
