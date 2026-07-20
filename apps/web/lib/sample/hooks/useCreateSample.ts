// apps/web/lib/sample/hooks/useCreateSample.ts

"use client";

import { useState, useCallback } from "react";
import { Sample } from "../models/types";
import { SampleFormData } from "../models/form";
import { SampleService } from "../services/SampleService";

/**
 * Hook that wraps SampleService.createSample.
 * Returns { createSample, loading, error, success }.
 */
export function useCreateSample() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const createSample = useCallback(
    async (form: SampleFormData): Promise<Sample | null> => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const service = new SampleService();
        const created = await service.createSample(form);
        setSuccess(true);
        return created;
      } catch (e) {
        setError(e as Error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { createSample, loading, error, success } as const;
}
