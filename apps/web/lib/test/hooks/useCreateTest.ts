// apps/web/lib/test/hooks/useCreateTest.ts

"use client";

import { useState, useCallback } from "react";
import { TestService } from "../services/TestService";
import { TestMapper, TestFormData } from "../models/form";
import { validateTest } from "../validation/validateTest";
import { Test } from "../models/types";

export function useCreateTest() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const createTest = useCallback(async (form: TestFormData): Promise<Test | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const validation = validateTest(form);
      if (!validation.isValid) {
        throw new Error("Validation failed");
      }
      const test = TestMapper.toTest(form);
      const service = new TestService();
      const created = await service.createTest(test);
      setSuccess(true);
      return created;
    } catch (e) {
      setError(e as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createTest, loading, error, success } as const;
}
