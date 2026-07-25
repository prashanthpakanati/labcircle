// apps/web/lib/analytics/__tests__/forecastEngine.test.ts

import { describe, it, expect } from "vitest";
import { ForecastEngine } from "../utils/ForecastEngine";
import { ForecastPeriod } from "../models/enums";

describe("ForecastEngine Explainable Trends", () => {
  it("projects future periods based on simple historical growth trend", () => {
    const res = ForecastEngine.generateForecast(
      "Revenue",
      ForecastPeriod.MONTHLY,
      [100, 110, 121], // 10% month-over-month growth
      3
    );

    expect(res.currentValue).toBe(121);
    expect(res.growthRateAssumedPercent).toBe(10);
    expect(res.projectedValues.length).toBe(3);
    expect(res.projectedValues[0].value).toBe(133); // 121 * 1.10 = 133.1 -> 133
  });
});
