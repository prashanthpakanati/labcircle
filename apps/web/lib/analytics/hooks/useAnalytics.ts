// apps/web/lib/analytics/hooks/useAnalytics.ts

"use client";

import { useState, useEffect, useCallback } from "react";
import { AnalyticsService, AnalyticsRole } from "../services/AnalyticsService";
import { ExecutiveDashboardMetrics, FinancialAnalyticsSummary, ForecastModel } from "../models/types";
import { GenerateReportExportFormData, GenerateForecastFormData } from "../models/form";

const service = new AnalyticsService();

export function useExecutiveDashboard() {
  const [metrics, setMetrics] = useState<ExecutiveDashboardMetrics | null>(null);

  useEffect(() => {
    setMetrics(service.getExecutiveMetrics());
  }, []);

  return { metrics };
}

export function useFinancialAnalytics() {
  const [financials, setFinancials] = useState<FinancialAnalyticsSummary | null>(null);

  useEffect(() => {
    setFinancials(service.getFinancialSummary());
  }, []);

  return { financials };
}

export function useAnalyticsMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateForecast = useCallback((formData: GenerateForecastFormData): ForecastModel | null => {
    try {
      return service.generateForecast(formData);
    } catch (err: unknown) {
      setError((err as Error).message);
      return null;
    }
  }, []);

  const exportReport = useCallback(async (formData: GenerateReportExportFormData, actorId: string, role: AnalyticsRole) => {
    setLoading(true);
    setError(null);
    try {
      const res = await service.exportReport(formData, actorId, role);
      setLoading(false);
      return res;
    } catch (err: unknown) {
      setError((err as Error).message);
      setLoading(false);
      return null;
    }
  }, []);

  return { generateForecast, exportReport, loading, error };
}
