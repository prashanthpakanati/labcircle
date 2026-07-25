// apps/web/lib/analytics/utils/KPIEngine.ts

import { KPISnapshot } from "../models/types";
import { TrendDirection } from "../models/enums";

export class KPIEngine {
  /**
   * Deterministic KPI calculation evaluating actual value vs target, variance %, and trend.
   */
  static evaluateKPI(
    kpiCode: string,
    name: string,
    actualValue: number,
    targetValue: number,
    unit: string,
    previousValue: number
  ): KPISnapshot {
    let variancePercent = 0;
    if (targetValue > 0) {
      variancePercent = Math.round(((actualValue - targetValue) / targetValue) * 100);
    }

    let trend = TrendDirection.STABLE;
    if (actualValue > previousValue) {
      trend = TrendDirection.UPWARD;
    } else if (actualValue < previousValue) {
      trend = TrendDirection.DOWNWARD;
    }

    return {
      kpiCode,
      name,
      actualValue,
      targetValue,
      unit,
      variancePercent,
      trend,
    };
  }
}
