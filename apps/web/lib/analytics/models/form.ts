// apps/web/lib/analytics/models/form.ts

import { ReportType, ExportFormat, ForecastPeriod } from "./enums";

export interface GenerateReportExportFormData {
  reportType: ReportType;
  format: ExportFormat;
  dateRangeStart?: string;
  dateRangeEnd?: string;
}

export interface GenerateForecastFormData {
  metricName: string;
  period: ForecastPeriod;
  historicalValues: number[];
  forecastPeriodsCount: number;
}
