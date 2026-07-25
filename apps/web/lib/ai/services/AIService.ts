// apps/web/lib/ai/services/AIService.ts

import { getFirestore, collection, doc, serverTimestamp, Timestamp } from "firebase/firestore";
import { ApprovalRepository } from "../repositories/ApprovalRepository";
import { AIAuditRepository } from "../repositories/AIAuditRepository";
import { AIResponse, AIRecommendation, ApprovalRequest, AIAuditRecord } from "../models/types";
import { AIProvider, ApprovalStatus, ApprovalType } from "../models/enums";
import { QueryCopilotFormData, HumanApprovalFormData } from "../models/form";
import { MockAIAdapter } from "../adapters/AIProviderAdapter";
import { ResponseSafetyEngine } from "../utils/ResponseSafetyEngine";
import { RecommendationEngine } from "../utils/RecommendationEngine";
import { validateCopilotQuery, validateHumanApproval } from "../validation/validateAI";

export type AIRole = "SuperAdmin" | "Admin" | "Doctor" | "Pathologist" | "OperationsManager" | "Patient" | "User";

export class AIService {
  private approvalRepo = new ApprovalRepository();
  private auditRepo = new AIAuditRepository();
  private mockAdapter = new MockAIAdapter();
  private db = getFirestore();

  private async audit(requestId: string, provider: AIProvider, tokenUsage: number, costINR: number): Promise<void> {
    const id = doc(collection(this.db, "ai_audit")).id;
    const now = serverTimestamp() as unknown as Timestamp;
    const record: AIAuditRecord = {
      id,
      requestId,
      provider,
      model: this.mockAdapter.defaultModel,
      payloadHash: `HASH-${Date.now()}`,
      tokenUsage,
      costINR,
      timestamp: now,
    };
    await this.auditRepo.logAction(record);
  }

  // ── Public AI Gateway & Copilot API ──────────────────────────────────────

  /**
   * Universal AI Gateway query endpoint.
   * AI never modifies operational data directly.
   */
  async queryCopilot(formData: QueryCopilotFormData, actorId: string, actorRole: AIRole): Promise<AIResponse> {
    if (!actorId || !actorRole) throw new Error("Actor information required");
    const val = validateCopilotQuery(formData);
    if (!val.isValid) throw new Error(`Validation failed: ${JSON.stringify(val.errors)}`);

    // 1. Response Safety Sanitization (PII Masking)
    const { sanitizedPrompt } = ResponseSafetyEngine.sanitizeInput(formData.prompt);

    // 2. Route via Provider Adapter
    const res = await this.mockAdapter.generate(sanitizedPrompt);
    const reqId = doc(collection(this.db, "ai_requests")).id;
    const respId = doc(collection(this.db, "ai_responses")).id;
    const now = serverTimestamp() as unknown as Timestamp;

    const responseRecord: AIResponse = {
      id: respId,
      requestId: reqId,
      provider: AIProvider.MOCK,
      model: this.mockAdapter.defaultModel,
      responseText: res.responseText,
      promptTokens: res.promptTokens,
      completionTokens: res.completionTokens,
      costINR: res.costINR,
      latencyMs: 150,
      createdAt: now,
    };

    await this.audit(reqId, AIProvider.MOCK, res.promptTokens + res.completionTokens, res.costINR);
    return responseRecord;
  }

  /**
   * Generates explainable recommendation requiring human approval.
   */
  async generateRecommendation(
    type: string,
    targetEntityId: string,
    confidencePercent: number,
    reasoning: string,
    evidence: string[]
  ): Promise<{ recommendation: AIRecommendation; approvalRequest: ApprovalRequest }> {
    const rawRec = RecommendationEngine.createRecommendation(type, targetEntityId, confidencePercent, reasoning, evidence);
    const recId = doc(collection(this.db, "ai_recommendations")).id;
    const reqId = doc(collection(this.db, "approval_requests")).id;
    const now = serverTimestamp() as unknown as Timestamp;

    const recommendation: AIRecommendation = {
      ...rawRec,
      id: recId,
    } as AIRecommendation;

    const approvalRequest: ApprovalRequest = {
      id: reqId,
      recommendationId: recId,
      type: ApprovalType.OPERATIONAL,
      requiredRole: "OperationsManager",
      status: ApprovalStatus.PENDING,
      requestedAt: now,
    };

    await this.approvalRepo.createRequest(approvalRequest);
    return { recommendation, approvalRequest };
  }

  /**
   * Processes human approval/rejection decision on AI recommendation.
   */
  async processHumanApproval(formData: HumanApprovalFormData): Promise<void> {
    const val = validateHumanApproval(formData);
    if (!val.isValid) throw new Error(`Validation failed: ${JSON.stringify(val.errors)}`);

    const decId = doc(collection(this.db, "approval_decisions")).id;
    const now = serverTimestamp() as unknown as Timestamp;

    await this.approvalRepo.recordDecision(formData.approvalRequestId, {
      id: decId,
      requestId: formData.approvalRequestId,
      reviewerId: formData.reviewerId,
      decision: formData.decision === "APPROVED" ? ApprovalStatus.APPROVED : ApprovalStatus.REJECTED,
      comments: formData.comments,
      decidedAt: now,
    });
  }
}
