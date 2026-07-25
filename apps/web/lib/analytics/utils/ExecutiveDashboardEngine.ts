// apps/web/lib/analytics/utils/ExecutiveDashboardEngine.ts

import { ExecutiveDashboardMetrics } from "../models/types";

export class ExecutiveDashboardEngine {
  /**
   * Consolidates high-level executive KPIs across domain metrics (Read-only projection).
   */
  static consolidateExecutiveMetrics(
    grossRevenue: number,
    bookingsToday: number,
    collectionsToday: number,
    reportsDelivered: number,
    activeMemberships: number,
    patientsServed: number,
    previousMonthRevenue: number
  ): ExecutiveDashboardMetrics {
    const netRevenue = Math.round(grossRevenue * 0.88); // Net after operational expenses & refunds
    let growthRatePercent = 0;

    if (previousMonthRevenue > 0) {
      growthRatePercent = Math.round(((grossRevenue - previousMonthRevenue) / previousMonthRevenue) * 100);
    }

    return {
      totalRevenue: grossRevenue,
      bookingsToday,
      collectionsToday,
      reportsDelivered,
      activeMemberships,
      patientsServed,
      growthRatePercent,
      netRevenue,
    };
  }
}
