// apps/web/lib/sample/hooks/useUpdateSample.ts

"use client";

import { useState, useCallback } from "react";
import { SampleStatus } from "../models/enums";
import { SampleFormData } from "../models/form";
import { SampleService } from "../services/SampleService";

/**
 * Hook that wraps SampleService.updateSample.
 * Returns { updateSample, loading, error, success }.
 */
export function useUpdateSample() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const updateSample = useCallback(
    async (
      id: string,
      updates: Partial<SampleFormData> & { status?: SampleStatus }
    ): Promise<void> => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const service = new SampleService();
        await service.updateSample(id, updates);
        setSuccess(true);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { updateSample, loading, error, success } as const;
}
