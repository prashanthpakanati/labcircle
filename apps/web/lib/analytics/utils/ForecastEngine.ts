// apps/web/lib/analytics/utils/ForecastEngine.ts

import { ForecastModel } from "../models/types";
import { ForecastPeriod } from "../models/enums";

export class ForecastEngine {
  /**
   * Explainable linear trend forecasting projecting future periods based on moving averages.
   * No black-box machine learning algorithms.
   */
  static generateForecast(
    metricName: string,
    period: ForecastPeriod,
    historicalValues: number[],
    periodsToForecast = 3
  ): ForecastModel {
    if (historicalValues.length === 0) {
      return {
        metricName,
        period,
        currentValue: 0,
        projectedValues: [],
        growthRateAssumedPercent: 0,
      };
    }

    const currentValue = historicalValues[historicalValues.length - 1];

    // Compute simple average growth rate between historical periods
    let totalGrowth = 0;
    let growthSteps = 0;

    for (let i = 1; i < historicalValues.length; i++) {
      if (historicalValues[i - 1] > 0) {
        totalGrowth += (historicalValues[i] - historicalValues[i - 1]) / historicalValues[i - 1];
        growthSteps++;
      }
    }

    const avgGrowthRate = growthSteps > 0 ? totalGrowth / growthSteps : 0.05; // Default 5% trend
    const projectedValues: { periodLabel: string; value: number }[] = [];

    let lastVal = currentValue;
    for (let p = 1; p <= periodsToForecast; p++) {
      lastVal = Math.round(lastVal * (1 + avgGrowthRate));
      projectedValues.push({
        periodLabel: `Period +${p}`,
        value: lastVal,
      });
    }

    return {
      metricName,
      period,
      currentValue,
      projectedValues,
      growthRateAssumedPercent: Math.round(avgGrowthRate * 100),
    };
  }
}
