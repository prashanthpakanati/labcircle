// apps/web/lib/analytics/services/AnalyticsService.ts

import { getFirestore, collection, doc, serverTimestamp, Timestamp } from "firebase/firestore";
import { ReportExportRepository } from "../repositories/ReportExportRepository";
import { AnalyticsAuditRepository } from "../repositories/AnalyticsAuditRepository";
import { ExecutiveDashboardMetrics, FinancialAnalyticsSummary, ForecastModel, ReportExport, AnalyticsAuditRecord, KPISnapshot } from "../models/types";
import { GenerateReportExportFormData, GenerateForecastFormData } from "../models/form";
import { ExecutiveDashboardEngine } from "../utils/ExecutiveDashboardEngine";
import { FinancialAnalyticsEngine } from "../utils/FinancialAnalyticsEngine";
import { KPIEngine } from "../utils/KPIEngine";
import { ForecastEngine } from "../utils/ForecastEngine";
import { ReportingEngine } from "../utils/ReportingEngine";
import { validateExportRequest, validateForecastRequest } from "../validation/validateAnalytics";

export type AnalyticsRole = "SuperAdmin" | "Admin" | "Executive" | "FinanceManager" | "Viewer";

const EXPORT_ROLES: AnalyticsRole[] = ["SuperAdmin", "Admin", "Executive", "FinanceManager"];

export class AnalyticsService {
  private exportRepo = new ReportExportRepository();
  private auditRepo = new AnalyticsAuditRepository();
  private db = getFirestore();

  private assertRole(role: AnalyticsRole, allowed: AnalyticsRole[], action: string): void {
    if (!allowed.includes(role)) {
      throw new Error(`Permission Denied: Analytics role '${role}' is not authorized to ${action}.`);
    }
  }

  private async audit(action: string, actorId: string, actorRole: AnalyticsRole, targetReport?: string): Promise<void> {
    const id = doc(collection(this.db, "analytics_audit")).id;
    const now = serverTimestamp() as unknown as Timestamp;
    const record: AnalyticsAuditRecord = {
      id,
      action,
      actorId,
      actorRole,
      targetReport,
      timestamp: now,
    };
    await this.auditRepo.logAction(record);
  }

  // ── Read-Only Dashboards & Projections ──────────────────────────────────

  getExecutiveMetrics(): ExecutiveDashboardMetrics {
    return ExecutiveDashboardEngine.consolidateExecutiveMetrics(
      154500, // Total revenue ₹
      48,     // Bookings today
      42,     // Collections today
      38,     // Reports delivered
      120,    // Active memberships
      850,    // Patients served
      135000  // Previous month revenue
    );
  }

  getFinancialSummary(): FinancialAnalyticsSummary {
    return FinancialAnalyticsEngine.calculateFinancials(
      154500, // GMV
      120,    // Active members
      499,    // Monthly price
      3500,   // Refunds total
      850     // Total patients
    );
  }

  getKPISnapshot(kpiCode: string, name: string, actual: number, target: number, unit: string, prev: number): KPISnapshot {
    return KPIEngine.evaluateKPI(kpiCode, name, actual, target, unit, prev);
  }

  generateForecast(formData: GenerateForecastFormData): ForecastModel {
    const val = validateForecastRequest(formData);
    if (!val.isValid) throw new Error(`Validation failed: ${JSON.stringify(val.errors)}`);

    return ForecastEngine.generateForecast(
      formData.metricName,
      formData.period,
      formData.historicalValues,
      formData.forecastPeriodsCount || 3
    );
  }

  async exportReport(
    formData: GenerateReportExportFormData,
    actorId: string,
    actorRole: AnalyticsRole
  ): Promise<{ exportRecord: ReportExport; payload: string }> {
    this.assertRole(actorRole, EXPORT_ROLES, "export analytics report");

    const val = validateExportRequest(formData);
    if (!val.isValid) throw new Error(`Validation failed: ${JSON.stringify(val.errors)}`);

    const sampleData = [
      { Metric: "Total Revenue", Value: "₹1,54,500" },
      { Metric: "Bookings Today", Value: 48 },
      { Metric: "Reports Delivered", Value: 38 },
    ];

    const payload = ReportingEngine.formatCSV(formData.reportType, sampleData);
    const id = doc(collection(this.db, "report_exports")).id;
    const now = serverTimestamp() as unknown as Timestamp;

    const exportRecord: ReportExport = {
      id,
      reportType: formData.reportType,
      format: formData.format,
      exportedBy: actorId,
      exportedAt: now,
    };

    await this.exportRepo.create(exportRecord);
    await this.audit("EXPORT_REPORT", actorId, actorRole, formData.reportType);

    return { exportRecord, payload };
  }
}
