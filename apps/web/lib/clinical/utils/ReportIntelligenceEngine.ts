// apps/web/lib/clinical/utils/ReportIntelligenceEngine.ts

import { ClinicalReport, ClinicalKnowledge } from "../models/types";

export interface IntelligentReportExplanation {
  reportId: string;
  summary: string;
  abnormalHighlights: string[];
  lifestyleGuidance: string[];
  preventiveGuidance: string[];
  safetyNotice: string;
}

export class ReportIntelligenceEngine {
  /**
   * Generates AI-assisted plain-language report explanations by consuming the Clinical Knowledge Layer.
   * AI Safety Principle: NEVER modifies lab values, generates diagnoses, or overrides physician conclusions.
   */
  static generateExplanation(
    report: ClinicalReport,
    knowledgeBase: Record<string, ClinicalKnowledge>
  ): IntelligentReportExplanation {
    const abnormalObs = report.observations.filter((o) => o.isAbnormal);

    const abnormalHighlights: string[] = abnormalObs.map((o) => {
      const know = knowledgeBase[o.testCode];
      const detail = know ? ` — ${know.plainLanguageSummary}` : "";
      return `${o.testName}: Recorded ${o.value} ${o.unit} (Reference Range: ${o.referenceRangeText})${detail}`;
    });

    const lifestyleGuidance: string[] = [];
    const preventiveGuidance: string[] = [];

    abnormalObs.forEach((o) => {
      const know = knowledgeBase[o.testCode];
      if (know) {
        lifestyleGuidance.push(...know.lifestyleRecommendations);
        preventiveGuidance.push(...know.preventiveGuidance);
      }
    });

    // Fallbacks if no abnormal items
    if (abnormalHighlights.length === 0) {
      abnormalHighlights.push("All observed biomarker parameters are within expected biological reference ranges.");
      lifestyleGuidance.push("Continue maintaining your healthy lifestyle, balanced nutrition, and regular activity.");
      preventiveGuidance.push("Schedule routine annual screening as advised by your healthcare provider.");
    }

    const summary = abnormalObs.length > 0
      ? `Report contains ${abnormalObs.length} parameter(s) requiring attention. Consult your physician to discuss these findings.`
      : `Report parameters are within normal biological reference ranges. Overall results indicate healthy baseline markers.`;

    return {
      reportId: report.id,
      summary,
      abnormalHighlights: Array.from(new Set(abnormalHighlights)),
      lifestyleGuidance: Array.from(new Set(lifestyleGuidance)),
      preventiveGuidance: Array.from(new Set(preventiveGuidance)),
      safetyNotice: "Notice: This AI-assisted explanation is educational and for patient context. It does NOT constitute medical diagnosis or treatment advice. Consult your physician.",
    };
  }
}
