// apps/web/lib/ai/models/types.ts

import { Timestamp } from "firebase/firestore";
import {
  AIProvider,
  PromptStatus,
  RecommendationStatus,
  ApprovalStatus,
  ApprovalType,
  AIRequestStatus,
} from "./enums";

export interface AIRequest {
  id: string;
  copilotType: "PATIENT" | "OPERATIONS" | "CLINICAL" | "FINANCE";
  provider: AIProvider;
  model: string;
  promptText: string;
  tokenEstimate: number;
  status: AIRequestStatus;
  createdAt: Timestamp;
}

export interface AIResponse {
  id: string;
  requestId: string;
  provider: AIProvider;
  model: string;
  responseText: string;
  promptTokens: number;
  completionTokens: number;
  costINR: number;
  latencyMs: number;
  createdAt: Timestamp;
}

export interface ConversationSession {
  id: string;
  userId: string;
  copilotType: string;
  title: string;
  messageCount: number;
  createdAt: Timestamp;
}

export interface ConversationMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant" | "system";
  content: string;
  citations?: string[];
  timestamp: Timestamp;
}

export interface PromptTemplate {
  id: string;
  code: string;
  name: string;
  category: string;
  templateBody: string;
  status: PromptStatus;
  version: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  sourceDomain: string;
  content: string;
  rbacRoles: string[];
  createdAt: Timestamp;
}

export interface KnowledgeChunk {
  id: string;
  documentId: string;
  chunkIndex: number;
  text: string;
}

export interface RetrievalResult {
  chunkId: string;
  documentTitle: string;
  text: string;
  relevanceScore: number;
}

export interface AIRecommendation {
  id: string;
  type: string;
  targetEntityId: string;
  confidencePercent: number;
  reasoning: string;
  evidence: string[];
  status: RecommendationStatus;
  createdAt: Timestamp;
}

export interface ApprovalRequest {
  id: string;
  recommendationId: string;
  type: ApprovalType;
  requiredRole: string;
  status: ApprovalStatus;
  requestedAt: Timestamp;
}

export interface ApprovalDecision {
  id: string;
  requestId: string;
  reviewerId: string;
  decision: ApprovalStatus;
  comments: string;
  decidedAt: Timestamp;
}

export interface AIAuditRecord {
  id: string;
  requestId: string;
  provider: AIProvider;
  model: string;
  payloadHash: string;
  tokenUsage: number;
  costINR: number;
  timestamp: Timestamp;
}
