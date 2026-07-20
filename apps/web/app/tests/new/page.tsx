// apps/web/app/tests/new/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import TestForm, { FullTestFormState } from "../../../lib/test/components/TestForm";
import { useCreateTest } from "../../../lib/test/hooks/useCreateTest";
import { useTests } from "../../../lib/test/hooks/useTests";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function CreateTestPage() {
  const router = useRouter();
  const { createTest, loading, error: createError } = useCreateTest();
  const { data: existingTests } = useTests();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Existing test codes for duplicate check
  const existingCodes = useMemo(() => {
    if (!existingTests) return [];
    return existingTests.map((t) => t.code.toUpperCase());
  }, [existingTests]);

  const handleSubmit = async (formData: FullTestFormState) => {
    const created = await createTest(formData);
    if (created) {
      setSuccessMsg(`Test "${created.name}" (${created.displayId}) successfully created!`);
      setTimeout(() => {
        router.push(`/tests/${created.id}`);
      }, 1000);
    }
  };

  const handleCancel = () => {
    router.push("/tests/list");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <Link
          href="/tests/list"
          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-slate-800 transition-colors"
          aria-label="Back to Test List"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          Back to Test List
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create New Test</h1>
        <p className="text-sm text-muted-foreground">
          Define diagnostic test parameters, turnaround times, and pricing models.
        </p>
      </div>

      {successMsg && (
        <Alert variant="success">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMsg}</AlertDescription>
        </Alert>
      )}

      <TestForm
        onSubmit={handleSubmit}
        isSubmitting={loading}
        submitText="Create Test"
        onCancel={handleCancel}
        serverError={createError?.message}
        existingCodes={existingCodes}
      />
    </div>
  );
}
