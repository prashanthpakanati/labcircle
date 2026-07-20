// apps/web/lib/sample/hooks/useUpdateSampleStatus.ts

"use client";

import { useState, useCallback } from "react";
import { SampleStatus } from "../models/enums";
import { SampleService } from "../services/SampleService";

/**
 * Hook that wraps SampleService.updateSampleStatus.
 * Handles loading, error, and success state.
 */
export function useUpdateSampleStatus() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const updateStatus = useCallback(
    async (id: string, newStatus: SampleStatus): Promise<boolean> => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const service = new SampleService();
        await service.updateSampleStatus(id, newStatus);
        setSuccess(true);
        return true;
      } catch (e) {
        setError(e as Error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { updateStatus, loading, error, success } as const;
}
