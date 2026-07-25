// apps/web/lib/analytics/__tests__/executiveEngine.test.ts

import { describe, it, expect } from "vitest";
import { ExecutiveDashboardEngine } from "../utils/ExecutiveDashboardEngine";

describe("ExecutiveDashboardEngine", () => {
  it("consolidates cross-domain executive metrics correctly", () => {
    const metrics = ExecutiveDashboardEngine.consolidateExecutiveMetrics(
      100000,
      50,
      40,
      35,
      100,
      500,
      80000
    );

    expect(metrics.totalRevenue).toBe(100000);
    expect(metrics.bookingsToday).toBe(50);
    expect(metrics.collectionsToday).toBe(40);
    expect(metrics.growthRatePercent).toBe(25); // (100k - 80k)/80k * 100 = 25%
    expect(metrics.netRevenue).toBe(88000); // 88% of 100k
  });
});
