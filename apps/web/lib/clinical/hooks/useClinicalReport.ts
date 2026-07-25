// apps/web/lib/clinical/hooks/useClinicalReport.ts

"use client";

import { useState, useEffect, useCallback } from "react";
import { ClinicalReportService, ClinicalRole } from "../services/ClinicalReportService";
import { ClinicalReport, ClinicalKnowledge } from "../models/types";
import { ReportIntelligenceEngine } from "../utils/ReportIntelligenceEngine";
import { ClinicalKnowledgeEngine } from "../utils/ClinicalKnowledgeEngine";
import { CreateReportFormData, ApproveReportFormData, AmendReportFormData } from "../models/form";

const service = new ClinicalReportService();

export function useClinicalReport(id: string | null | undefined) {
  const [data, setData] = useState<ClinicalReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);

    service
      .getReport(id)
      .then((res) => {
        if (!cancelled) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, tick]);

  return { data, loading, error, refetch };
}

export function useReportIntelligence(report: ClinicalReport | null | undefined) {
  const [explanation, setExplanation] = useState<ReturnType<typeof ReportIntelligenceEngine.generateExplanation> | null>(null);

  useEffect(() => {
    if (!report) return;
    const mockKnowledge: Record<string, ClinicalKnowledge> = {};
    report.observations.forEach((o) => {
      mockKnowledge[o.testCode] = ClinicalKnowledgeEngine.getDefaultKnowledge(o.testCode, o.testName);
    });

    const res = ReportIntelligenceEngine.generateExplanation(report, mockKnowledge);
    setExplanation(res);
  }, [report]);

  return { explanation };
}

export function useReportMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReport = useCallback(async (formData: CreateReportFormData, actorId: string, role: ClinicalRole) => {
    setLoading(true);
    setError(null);
    try {
      const res = await service.createReport(formData, actorId, role);
      setLoading(false);
      return res;
    } catch (err: unknown) {
      setError((err as Error).message);
      setLoading(false);
      return null;
    }
  }, []);

  const approveReport = useCallback(async (formData: ApproveReportFormData, actorId: string, role: ClinicalRole) => {
    setLoading(true);
    setError(null);
    try {
      const res = await service.approveReport(formData, actorId, role);
      setLoading(false);
      return res;
    } catch (err: unknown) {
      setError((err as Error).message);
      setLoading(false);
      return null;
    }
  }, []);

  const publishReport = useCallback(async (reportId: string, actorId: string, role: ClinicalRole) => {
    setLoading(true);
    setError(null);
    try {
      const res = await service.publishReport(reportId, actorId, role);
      setLoading(false);
      return res;
    } catch (err: unknown) {
      setError((err as Error).message);
      setLoading(false);
      return null;
    }
  }, []);

  const amendReport = useCallback(async (formData: AmendReportFormData, actorId: string, role: ClinicalRole) => {
    setLoading(true);
    setError(null);
    try {
      const res = await service.amendReport(formData, actorId, role);
      setLoading(false);
      return res;
    } catch (err: unknown) {
      setError((err as Error).message);
      setLoading(false);
      return null;
    }
  }, []);

  return { createReport, approveReport, publishReport, amendReport, loading, error };
}
