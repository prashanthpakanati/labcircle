// apps/web/lib/analytics/models/types.ts

import { Timestamp } from "firebase/firestore";
import {
  ReportType,
  ForecastPeriod,
  AlertSeverity,
  AlertStatus,
  ExportFormat,
  TrendDirection,
} from "./enums";

export interface ExecutiveDashboardMetrics {
  totalRevenue: number;
  bookingsToday: number;
  collectionsToday: number;
  reportsDelivered: number;
  activeMemberships: number;
  patientsServed: number;
  growthRatePercent: number;
  netRevenue: number;
}

export interface FinancialAnalyticsSummary {
  gmv: number;
  netRevenue: number;
  grossMarginPercent: number;
  mrr: number;
  arr: number;
  arpu: number;
  cac: number;
  ltv: number;
  refundRatePercent: number;
}

export interface OperationalAnalyticsSummary {
  bookingFunnelConversionPercent: number;
  averageTATMinutes: number;
  technicianUtilizationPercent: number;
  cancellationRatePercent: number;
  collectionSlaPercent: number;
}

export interface ClinicalAnalyticsSummary {
  topOrderedTests: { testCode: string; count: number }[];
  abnormalResultRatePercent: number;
  criticalAlertCount: number;
}

export interface KPISnapshot {
  kpiCode: string;
  name: string;
  actualValue: number;
  targetValue: number;
  unit: string;
  variancePercent: number;
  trend: TrendDirection;
}

export interface ForecastModel {
  metricName: string;
  period: ForecastPeriod;
  currentValue: number;
  projectedValues: { periodLabel: string; value: number }[];
  growthRateAssumedPercent: number;
}

export interface ReportExport {
  id: string;
  reportType: ReportType;
  format: ExportFormat;
  exportedBy: string;
  exportedAt: Timestamp;
}

export interface AnalyticsAlert {
  id: string;
  kpiCode: string;
  title: string;
  severity: AlertSeverity;
  status: AlertStatus;
  message: string;
  triggeredAt: Timestamp;
}

export interface AnalyticsAuditRecord {
  id: string;
  action: string; // e.g. "GENERATE_SNAPSHOT", "EXPORT_REPORT"
  actorId: string;
  actorRole: string;
  targetReport?: string;
  timestamp: Timestamp;
}
