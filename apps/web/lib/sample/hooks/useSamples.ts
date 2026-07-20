// apps/web/lib/sample/hooks/useSamples.ts

"use client";

import { useState, useEffect, useCallback } from "react";
import { Sample } from "../models/types";
import { SampleService } from "../services/SampleService";

/**
 * Fetches all Samples.
 * Returns { data, loading, error, refetch }.
 */
export function useSamples() {
  const [data, setData] = useState<Sample[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSamples = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const service = new SampleService();
      const samples = await service.listSamples();
      setData(samples);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSamples();
  }, [fetchSamples]);

  return { data, loading, error, refetch: fetchSamples };
}
