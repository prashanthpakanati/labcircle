// apps/web/lib/test/components/TestDetailsHeader.tsx

"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Edit, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import TestStatusBadge from "./TestStatusBadge";
import { Test } from "../models/types";
import { TestStatus } from "../models/enums";
import { useUpdateTest } from "../hooks/useUpdateTest";

interface TestDetailsHeaderProps {
  test: Test;
  onRefresh?: () => void;
}

export default function TestDetailsHeader({ test, onRefresh }: TestDetailsHeaderProps) {
  const { updateTest, loading: updating } = useUpdateTest();

  const toggleStatus = async () => {
    const newStatus = test.status === TestStatus.Active ? TestStatus.Inactive : TestStatus.Active;
    await updateTest(test.id, { status: newStatus });
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center justify-between">
        <Link
          href="/tests/list"
          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-slate-800 transition-colors"
          aria-label="Back to Test List"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Test List
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-6 rounded-lg border border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-muted-foreground font-semibold">{test.displayId}</span>
            <span className="bg-slate-200 text-slate-800 text-xs px-2 py-0.5 rounded font-mono font-bold">
              {test.code}
            </span>
            <TestStatusBadge status={test.status} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{test.name}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={test.status === TestStatus.Active ? "outline" : "primary"}
            size="sm"
            onClick={toggleStatus}
            isLoading={updating}
            className="gap-1.5"
            aria-label={test.status === TestStatus.Active ? "Deactivate Test" : "Activate Test"}
          >
            <Power className="h-4 w-4" />
            {test.status === TestStatus.Active ? "Deactivate Test" : "Activate Test"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled
            title="Edit feature available in next milestone"
            aria-label="Edit Test (disabled)"
          >
            <Edit className="h-4 w-4" />
            Edit Test
          </Button>
        </div>
      </div>
    </div>
  );
}
