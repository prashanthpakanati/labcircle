// apps/web/lib/clinical/__tests__/trendEngine.test.ts

import { describe, it, expect } from "vitest";
import { TrendAnalysisEngine } from "../utils/TrendAnalysisEngine";
import { TrendDirection } from "../models/enums";

describe("TrendAnalysisEngine", () => {
  it("detects UPWARD trend in biomarker history", () => {
    const points = [
      { reportId: "r-1", date: "2026-01-01", value: 5.4, unit: "%", isAbnormal: false },
      { reportId: "r-2", date: "2026-06-01", value: 6.2, unit: "%", isAbnormal: true },
    ];

    const res = TrendAnalysisEngine.analyzeBiomarkerTrend("p-1", "HBA1C", "HbA1c", points);
    expect(res.currentTrend).toBe(TrendDirection.UPWARD);
  });

  it("detects CRITICAL_SPIKE when delta exceeds 30% on abnormal value", () => {
    const points = [
      { reportId: "r-1", date: "2026-01-01", value: 100, unit: "mg/dL", isAbnormal: false },
      { reportId: "r-2", date: "2026-06-01", value: 160, unit: "mg/dL", isAbnormal: true },
    ];

    const res = TrendAnalysisEngine.analyzeBiomarkerTrend("p-1", "GLUCOSE", "Glucose", points);
    expect(res.currentTrend).toBe(TrendDirection.CRITICAL_SPIKE);
  });
});
