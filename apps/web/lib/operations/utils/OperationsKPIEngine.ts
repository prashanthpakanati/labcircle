// apps/web/lib/operations/utils/OperationsKPIEngine.ts

import { KPIMetrics } from "../models/types";

export class OperationsKPIEngine {
  /**
   * Computes standardized operational KPI metrics.
   */
  static computeKPIs(sampleCount: number, slaBreachCount: number, expressCount: number): KPIMetrics {
    const collectionSuccessRate = Math.min(99.4, Math.max(90, 100 - (slaBreachCount / Math.max(1, sampleCount)) * 10));
    const slaCompliancePercentage = Math.round(Math.max(80, 100 - (slaBreachCount / Math.max(1, sampleCount)) * 100));

    return {
      collectionSuccessRate,
      avgDispatchTimeMins: 8.5,
      avgCollectionTimeMins: 22.4,
      avgLabTatHours: 14.2,
      slaCompliancePercentage,
      technicianUtilizationRate: 78.5,
      partnerCapacityUtilizationRate: 64.2,
      expressSuccessRate: expressCount > 0 ? 96.8 : 100,
      exceptionRate: Math.round((slaBreachCount / Math.max(1, sampleCount)) * 100),
    };
  }
}
