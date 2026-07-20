// apps/web/lib/test/hooks/useTests.ts

import { useState, useEffect, useCallback } from "react";
import { Test } from "../models/types";
import { TestService } from "../services/TestService";

/**
 * Hook to fetch all tests.
 * Returns { data, loading, error, refetch }.
 */
export function useTests() {
  const [data, setData] = useState<Test[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const service = new TestService();
      const tests = await service.listTests();
      setData(tests);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  return { data, loading, error, refetch: fetchTests };
}
