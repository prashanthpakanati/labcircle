// apps/web/lib/analytics/validation/validateAnalytics.ts

import { GenerateReportExportFormData, GenerateForecastFormData } from "../models/form";

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<string, string>>;
}

export function validateExportRequest(data: GenerateReportExportFormData): ValidationResult {
  const errors: Partial<Record<string, string>> = {};

  if (!data.reportType) errors.reportType = "Report type is required";
  if (!data.format) errors.format = "Export format is required";

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateForecastRequest(data: GenerateForecastFormData): ValidationResult {
  const errors: Partial<Record<string, string>> = {};

  if (!data.metricName?.trim()) errors.metricName = "Metric name is required";
  if (!data.period) errors.period = "Forecast period is required";
  if (!data.historicalValues || data.historicalValues.length === 0) {
    errors.historicalValues = "Historical values are required";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
