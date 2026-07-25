// apps/web/lib/analytics/utils/ReportingEngine.ts

import { ReportType } from "../models/enums";

export class ReportingEngine {
  /**
   * Formats structured analytics data into CSV export string payload.
   */
  static formatCSV(reportType: ReportType, data: Record<string, unknown>[]): string {
    if (data.length === 0) return "No data available";

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) => Object.values(row).map((v) => `"${v}"`).join(","));

    return [headers, ...rows].join("\n");
  }
}
