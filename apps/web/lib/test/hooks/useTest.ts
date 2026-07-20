// apps/web/lib/test/hooks/useTest.ts

import { useState, useEffect, useCallback } from "react";
import { Test } from "../models/types";
import { TestService } from "../services/TestService";

/** Hook to fetch a single test by Firestore document ID. */
export function useTest(id: string) {
  const [data, setData] = useState<Test | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTest = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const service = new TestService();
      const test = await service.getTest(id);
      setData(test);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTest();
  }, [fetchTest]);

  return { data, loading, error, refetch: fetchTest };
}
