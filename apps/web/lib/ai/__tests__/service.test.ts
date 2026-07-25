// apps/web/lib/ai/__tests__/service.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApprovalStatus } from "../models/enums";
import { Timestamp } from "firebase/firestore";

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn(() => ({})),
    doc: vi.fn(() => ({ id: "gen-ai-id" })),
    setDoc: vi.fn().mockResolvedValue(undefined),
    updateDoc: vi.fn().mockResolvedValue(undefined),
    serverTimestamp: vi.fn(() => Timestamp.now()),
  };
});

const mockApprovalRepo = {
  createRequest: vi.fn().mockResolvedValue(undefined),
  getRequestById: vi.fn().mockResolvedValue(null),
  recordDecision: vi.fn().mockResolvedValue(undefined),
};

const mockAuditRepo = {
  logAction: vi.fn().mockResolvedValue(undefined),
  search: vi.fn().mockResolvedValue({ auditLogs: [], nextCursor: undefined }),
};

vi.mock("../repositories/ApprovalRepository", () => ({
  ApprovalRepository: vi.fn(function () {
    return mockApprovalRepo;
  }),
}));

vi.mock("../repositories/AIAuditRepository", () => ({
  AIAuditRepository: vi.fn(function () {
    return mockAuditRepo;
  }),
}));

const { AIService } = await import("../services/AIService");

describe("AIService Gateway & Human Approval Platform", () => {
  let service: InstanceType<typeof AIService>;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AIService();
  });

  it("queries copilot and logs immutable AI audit record without mutating operational data", async () => {
    const res = await service.queryCopilot(
      { copilotType: "PATIENT", prompt: "Explain Fasting Glucose 95 mg/dL" },
      "pat-1",
      "Patient"
    );

    expect(res.responseText).toContain("[AI Copilot Response]");
    expect(mockAuditRepo.logAction).toHaveBeenCalledTimes(1);
  });

  it("generates explainable AI recommendation requiring human approval", async () => {
    const { recommendation, approvalRequest } = await service.generateRecommendation(
      "PREVENTIVE_PACKAGE_SUGGESTION",
      "pat-1",
      92,
      "Patient has elevated HbA1c history",
      ["HbA1c = 6.2%", "Age = 45"]
    );

    expect(recommendation.confidencePercent).toBe(92);
    expect(approvalRequest.status).toBe(ApprovalStatus.PENDING);
    expect(mockApprovalRepo.createRequest).toHaveBeenCalledTimes(1);
  });

  it("processes human approval decision for AI recommendation", async () => {
    await service.processHumanApproval({
      approvalRequestId: "req-100",
      decision: "APPROVED",
      reviewerId: "doc-1",
      reviewerRole: "Doctor",
      comments: "Approved based on clinical history.",
    });

    expect(mockApprovalRepo.recordDecision).toHaveBeenCalledTimes(1);
  });
});
