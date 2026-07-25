// apps/web/lib/ai/hooks/useAI.ts

"use client";

import { useState, useCallback } from "react";
import { AIService, AIRole } from "../services/AIService";
import { QueryCopilotFormData, HumanApprovalFormData } from "../models/form";

const service = new AIService();

export function useCopilot() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryCopilot = useCallback(async (formData: QueryCopilotFormData, actorId: string, role: AIRole) => {
    setLoading(true);
    setError(null);
    try {
      const res = await service.queryCopilot(formData, actorId, role);
      setLoading(false);
      return res;
    } catch (err: unknown) {
      setError((err as Error).message);
      setLoading(false);
      return null;
    }
  }, []);

  const processApproval = useCallback(async (formData: HumanApprovalFormData) => {
    setLoading(true);
    setError(null);
    try {
      await service.processHumanApproval(formData);
      setLoading(false);
      return true;
    } catch (err: unknown) {
      setError((err as Error).message);
      setLoading(false);
      return false;
    }
  }, []);

  return { queryCopilot, processApproval, loading, error };
}
