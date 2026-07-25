// apps/web/lib/clinical/__tests__/reportIntelligence.test.ts

import { describe, it, expect } from "vitest";
import { ReportIntelligenceEngine } from "../utils/ReportIntelligenceEngine";
import { ClinicalReport, ClinicalKnowledge } from "../models/types";
import { ReportStatus, ReferenceRangeType, ApprovalStatus, KnowledgeCategory } from "../models/enums";
import { Timestamp } from "firebase/firestore";

describe("ReportIntelligenceEngine AI Safety", () => {
  const mockReport: ClinicalReport = {
    id: "rep-1",
    version: 1,
    bookingId: "b-1",
    fulfillmentId: "f-1",
    patientId: "p-1",
    patientName: "John Doe",
    patientAge: 45,
    patientGender: "MALE",
    serviceCategory: "LAB_TEST",
    status: ReportStatus.PUBLISHED,
    approvalStatus: ApprovalStatus.APPROVED,
    observations: [
      {
        id: "obs-1",
        testCode: "GLUCOSE_FASTING",
        testName: "Fasting Blood Glucose",
        value: 135,
        unit: "mg/dL",
        referenceRangeText: "70 - 99 mg/dL",
        rangeType: ReferenceRangeType.HIGH_RISK,
        isAbnormal: true,
        isCritical: false,
      },
    ],
    hasCriticalValue: false,
    createdAt: { seconds: 1000 } as unknown as Timestamp,
    updatedAt: { seconds: 1000 } as unknown as Timestamp,
    createdBy: "user-1",
    updatedBy: "user-1",
  };

  it("generates plain-language explanation without modifying lab values", () => {
    const knowledgeBase: Record<string, ClinicalKnowledge> = {
      GLUCOSE_FASTING: {
        id: "k-1",
        testCode: "GLUCOSE_FASTING",
        testName: "Fasting Blood Glucose",
        category: KnowledgeCategory.PATHOLOGY,
        plainLanguageSummary: "Evaluates blood sugar after an overnight fast.",
        clinicalContext: "Metabolic marker",
        lifestyleRecommendations: ["Reduce refined carbohydrates.", "Engage in daily exercise."],
        preventiveGuidance: ["Monitor HbA1c periodically."],
        disclaimer: "Educational context only.",
      },
    };

    const res = ReportIntelligenceEngine.generateExplanation(mockReport, knowledgeBase);

    expect(res.reportId).toBe("rep-1");
    expect(res.abnormalHighlights.length).toBeGreaterThan(0);
    expect(res.lifestyleGuidance).toContain("Reduce refined carbohydrates.");
    expect(res.safetyNotice).toMatch(/does NOT constitute medical diagnosis/);
    // Lab value in report remains intact
    expect(mockReport.observations[0].value).toBe(135);
  });
});
