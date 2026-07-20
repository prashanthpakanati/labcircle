// apps/web/lib/sample/hooks/useSample.ts

"use client";

import { useState, useEffect, useCallback } from "react";
import { Sample } from "../models/types";
import { SampleService } from "../services/SampleService";

/**
 * Fetches a single Sample by Firestore document ID.
 * Returns { data, loading, error, refetch }.
 */
export function useSample(id: string) {
  const [data, setData] = useState<Sample | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSample = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const service = new SampleService();
      const sample = await service.getSample(id);
      setData(sample);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSample();
  }, [fetchSample]);

  return { data, loading, error, refetch: fetchSample };
}
