// apps/web/lib/analytics/__tests__/financialAnalytics.test.ts

import { describe, it, expect } from "vitest";
import { FinancialAnalyticsEngine } from "../utils/FinancialAnalyticsEngine";

describe("FinancialAnalyticsEngine", () => {
  it("calculates GMV, MRR, ARR, ARPU, and refund rates", () => {
    const res = FinancialAnalyticsEngine.calculateFinancials(
      200000, // GMV
      100,    // Active members
      500,    // Monthly price
      10000,  // Refunds
      400     // Total patients
    );

    expect(res.gmv).toBe(200000);
    expect(res.netRevenue).toBe(190000);
    expect(res.mrr).toBe(50000); // 100 * 500
    expect(res.arr).toBe(600000); // 50k * 12
    expect(res.arpu).toBe(475); // 190,000 / 400 = 475
    expect(res.refundRatePercent).toBe(5); // (10,000 / 200,000) * 100 = 5%
  });
});
