// apps/web/lib/test/hooks/useUpdateTest.ts

"use client";

import { useState, useCallback } from "react";
import { TestService } from "../services/TestService";
import { TestFormData } from "../models/form";
import { TestStatus } from "../models/enums";

export function useUpdateTest() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const updateTest = useCallback(
    async (id: string, updates: Partial<TestFormData> & { status?: TestStatus }): Promise<void> => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const service = new TestService();
        await service.updateTest(id, updates);
        setSuccess(true);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { updateTest, loading, error, success } as const;
}
