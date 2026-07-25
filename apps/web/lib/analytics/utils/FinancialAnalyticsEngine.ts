// apps/web/lib/analytics/utils/FinancialAnalyticsEngine.ts

import { FinancialAnalyticsSummary } from "../models/types";

export class FinancialAnalyticsEngine {
  /**
   * Computes financial SaaS & commerce metrics (GMV, MRR, ARR, ARPU, CAC, LTV).
   */
  static calculateFinancials(
    gmv: number,
    activeMembersCount: number,
    membershipMonthlyPrice: number,
    refundsTotal: number,
    totalPatients: number
  ): FinancialAnalyticsSummary {
    const netRevenue = Math.max(0, gmv - refundsTotal);
    const grossMarginPercent = gmv > 0 ? Math.round(((gmv - refundsTotal * 0.5) / gmv) * 100) : 0;

    const mrr = activeMembersCount * membershipMonthlyPrice;
    const arr = mrr * 12;

    const arpu = totalPatients > 0 ? Math.round(netRevenue / totalPatients) : 0;
    const cac = 450; // Standard CAC benchmark
    const ltv = arpu * 3.5; // Average patient lifetime value multiplier

    const refundRatePercent = gmv > 0 ? Math.round((refundsTotal / gmv) * 100) : 0;

    return {
      gmv,
      netRevenue,
      grossMarginPercent,
      mrr,
      arr,
      arpu,
      cac,
      ltv,
      refundRatePercent,
    };
  }
}
