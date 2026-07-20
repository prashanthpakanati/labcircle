// apps/web/lib/test/hooks/useTestStats.ts

"use client";

import { useMemo } from "react";
import { useTests } from "./useTests";
import { TestStatus } from "../models/enums";

export interface TestStats {
  total: number;
  active: number;
  inactive: number;
  categoryCount: number;
  departmentCount: number;
}

export function useTestStats() {
  const { data: tests, loading, error } = useTests();

  const stats = useMemo<TestStats>(() => {
    if (!tests) {
      return { total: 0, active: 0, inactive: 0, categoryCount: 0, departmentCount: 0 };
    }
    const total = tests.length;
    const active = tests.filter((t) => t.status === TestStatus.Active).length;
    const inactive = tests.filter((t) => t.status === TestStatus.Inactive).length;
    
    const uniqueCategories = new Set(tests.map((t) => t.category));
    const uniqueDepartments = new Set(tests.map((t) => t.department));

    return {
      total,
      active,
      inactive,
      categoryCount: uniqueCategories.size,
      departmentCount: uniqueDepartments.size,
    };
  }, [tests]);

  return { stats, loading, error } as const;
}
