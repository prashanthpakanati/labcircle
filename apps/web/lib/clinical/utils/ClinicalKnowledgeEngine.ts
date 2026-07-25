// apps/web/lib/clinical/utils/ClinicalKnowledgeEngine.ts

import { ClinicalKnowledge, ReferenceRange } from "../models/types";
import { KnowledgeCategory, ReferenceRangeType } from "../models/enums";

export class ClinicalKnowledgeEngine {
  /**
   * Matches an observation value against biological reference ranges.
   */
  static evaluateObservationValue(
    value: number,
    refRange: ReferenceRange
  ): { rangeType: ReferenceRangeType; isAbnormal: boolean; isCritical: boolean } {
    if (refRange.lowValue !== undefined && value < refRange.lowValue) {
      const isCritical = value < refRange.lowValue * 0.7;
      return {
        rangeType: isCritical ? ReferenceRangeType.CRITICAL : ReferenceRangeType.BORDERLINE,
        isAbnormal: true,
        isCritical,
      };
    }

    if (refRange.highValue !== undefined && value > refRange.highValue) {
      const isCritical = value > refRange.highValue * 1.4;
      return {
        rangeType: isCritical ? ReferenceRangeType.CRITICAL : ReferenceRangeType.HIGH_RISK,
        isAbnormal: true,
        isCritical,
      };
    }

    return {
      rangeType: ReferenceRangeType.NORMAL,
      isAbnormal: false,
      isCritical: false,
    };
  }

  /**
   * Constructs default ClinicalKnowledge base entry for a test code.
   */
  static getDefaultKnowledge(testCode: string, testName: string): ClinicalKnowledge {
    return {
      id: `know-${testCode}`,
      testCode,
      testName,
      category: KnowledgeCategory.PATHOLOGY,
      plainLanguageSummary: `${testName} evaluates physiological markers to assess general metabolic and cellular health.`,
      clinicalContext: `Diagnostic observation for ${testName}.`,
      lifestyleRecommendations: [
        "Maintain a balanced hydration and nutrient-dense diet.",
        "Engage in regular moderate aerobic exercise as recommended by your physician.",
      ],
      preventiveGuidance: [
        "Schedule annual health checkups to monitor longitudinal biomarker trends.",
      ],
      disclaimer: "This clinical explanation is educational only and does not replace medical diagnosis from a licensed physician.",
    };
  }
}
