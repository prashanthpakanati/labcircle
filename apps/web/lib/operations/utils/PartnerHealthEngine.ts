// apps/web/lib/operations/utils/PartnerHealthEngine.ts

import { PartnerHealthScore, PartnerPerformanceRecord } from "../models/types";

export class PartnerHealthEngine {
  /**
   * Computes partner reliability scores (0-100), quality trends, and downtime flags.
   */
  static evaluateHealth(records: PartnerPerformanceRecord[]): PartnerHealthScore[] {
    return records.map((r) => {
      const capUtil = Math.round((r.totalAllocated / 500) * 100);
      const slaComp = Math.max(70, Math.min(100, Math.round(100 - r.avgTatHours * 1.2)));
      const reliabilityScore = Math.round(r.qualityScore * 0.5 + slaComp * 0.3 + (100 - r.rejectionRate * 10) * 0.2);

      let qualityTrend: "UPWARD" | "STABLE" | "DOWNWARD" = "STABLE";
      if (r.qualityScore >= 95) qualityTrend = "UPWARD";
      if (r.qualityScore < 85) qualityTrend = "DOWNWARD";

      const isDowntimeDetected = capUtil > 95 || r.rejectionRate > 5;

      return {
        partnerId: r.partnerId,
        partnerName: r.partnerName,
        reliabilityScore,
        slaCompliancePercentage: slaComp,
        capacityUtilizationPercentage: capUtil,
        qualityTrend,
        isDowntimeDetected,
      };
    });
  }
}
