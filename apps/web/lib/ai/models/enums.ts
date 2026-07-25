// apps/web/lib/ai/models/enums.ts

export enum AIProvider {
  OPENAI = "OPENAI",
  ANTHROPIC = "ANTHROPIC",
  GEMINI = "GEMINI",
  AZURE = "AZURE",
  MOCK = "MOCK",
}

export enum ModelCapability {
  CHAT = "CHAT",
  EMBEDDINGS = "EMBEDDINGS",
  STREAMING = "STREAMING",
  REASONING = "REASONING",
}

export enum PromptStatus {
  DRAFT = "DRAFT",
  UNDER_REVIEW = "UNDER_REVIEW",
  APPROVED = "APPROVED",
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
}

export enum ConversationStatus {
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
}

export enum KnowledgeStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export enum RecommendationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum ApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum ApprovalType {
  CLINICAL = "CLINICAL",
  FINANCIAL = "FINANCIAL",
  OPERATIONAL = "OPERATIONAL",
  ADMINISTRATIVE = "ADMINISTRATIVE",
}

export enum RetrievalStrategy {
  SEMANTIC = "SEMANTIC",
  KEYWORD = "KEYWORD",
  HYBRID = "HYBRID",
}

export enum TokenBudgetPolicy {
  STRICT = "STRICT",
  FLEXIBLE = "FLEXIBLE",
  UNLIMITED = "UNLIMITED",
}

export enum AIRequestStatus {
  QUEUED = "QUEUED",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  MODERATED = "MODERATED",
}

export enum FeedbackType {
  THUMBS_UP = "THUMBS_UP",
  THUMBS_DOWN = "THUMBS_DOWN",
  CORRECTION = "CORRECTION",
}
