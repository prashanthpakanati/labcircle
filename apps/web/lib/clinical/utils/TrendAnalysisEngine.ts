// apps/web/lib/clinical/utils/TrendAnalysisEngine.ts

import { TrendDirection } from "../models/enums";
import { PatientTimelineBiomarkerPoint, PatientTimeline } from "../models/types";

export class TrendAnalysisEngine {
  /**
   * Computes longitudinal trend direction (UPWARD, DOWNWARD, STABLE, CRITICAL_SPIKE)
   * from historical biomarker data points.
   */
  static analyzeBiomarkerTrend(
    patientId: string,
    biomarkerCode: string,
    biomarkerName: string,
    points: PatientTimelineBiomarkerPoint[]
  ): PatientTimeline {
    if (points.length < 2) {
      return {
        patientId,
        biomarkerCode,
        biomarkerName,
        points,
        currentTrend: TrendDirection.STABLE,
      };
    }

    const sorted = [...points].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const latest = sorted[sorted.length - 1];
    const previous = sorted[sorted.length - 2];

    let currentTrend = TrendDirection.STABLE;

    if (typeof latest.value === "number" && typeof previous.value === "number") {
      const deltaRatio = (latest.value - previous.value) / previous.value;

      if (deltaRatio > 0.3 && latest.isAbnormal) {
        currentTrend = TrendDirection.CRITICAL_SPIKE;
      } else if (deltaRatio > 0.05) {
        currentTrend = TrendDirection.UPWARD;
      } else if (deltaRatio < -0.05) {
        currentTrend = TrendDirection.DOWNWARD;
      }
    }

    return {
      patientId,
      biomarkerCode,
      biomarkerName,
      points: sorted,
      currentTrend,
    };
  }
}
