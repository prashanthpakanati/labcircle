// apps/web/app/tests/[id]/edit/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import TestForm, { FullTestFormState } from "../../../../lib/test/components/TestForm";
import { useUpdateTest } from "../../../../lib/test/hooks/useUpdateTest";
import { useTest } from "../../../../lib/test/hooks/useTest";

interface EditTestPageProps {
  params: Promise<{ id: string }>;
}

export default function EditTestPage({ params }: EditTestPageProps) {
  const router = useRouter();
  const { id } = React.use(params);

  const { data: test, loading: testLoading, error: testError } = useTest(id);
  const { updateTest, loading: updateLoading, success } = useUpdateTest();
  const [serverError, setServerError] = useState<string | null>(null);

  // Navigate back to the detail page after a successful update
  useEffect(() => {
    if (success) {
      router.push(`/tests/${id}`);
    }
  }, [success, id, router]);

  const handleSubmit = async (formData: FullTestFormState) => {
    setServerError(null);
    try {
      await updateTest(id, formData);
    } catch (e) {
      setServerError((e as Error).message ?? "Failed to save changes. Please try again.");
    }
  };

  // ─── Loading state ──────────────────────────────────────────────────────────
  if (testLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p className="text-sm text-muted-foreground animate-pulse">Loading test details…</p>
      </div>
    );
  }

  // ─── Error state ────────────────────────────────────────────────────────────
  if (testError) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-destructive text-sm font-medium bg-destructive/10 p-4 rounded-lg border border-destructive/20">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Error loading test: {testError.message}</span>
        </div>
      </div>
    );
  }

  // ─── Not found state ────────────────────────────────────────────────────────
  if (!test) {
    return null;
  }

  const initialValues: Partial<FullTestFormState> = {
    name: test.name,
    code: test.code,
    department: test.department,
    category: test.category,
    specimenType: test.specimenType,
    method: test.method,
    homeCollection: test.homeCollection,
    tatHours: test.tatHours,
    urgentTatHours: test.urgentTatHours,
    mrp: test.mrp,
    b2bPrice: test.b2bPrice,
    labCirclePrice: test.labCirclePrice,
    status: test.status,
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Page header */}
      <header className="flex flex-col gap-2">
        <Link
          href={`/tests/${test.id}`}
          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-slate-800 transition-colors"
          aria-label="Back to Test"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          Back to Test
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Test</h1>
        <p className="text-sm text-muted-foreground">
          Update test details below. The test code is locked after creation.
        </p>
      </header>

      {serverError && (
        <div className="flex items-center gap-2 text-destructive text-sm font-medium bg-destructive/10 p-4 rounded-lg border border-destructive/20">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <TestForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isSubmitting={updateLoading}
        submitText="Save Changes"
        serverError={serverError}
        onCancel={() => router.push(`/tests/${test.id}`)}
        codeReadOnly
      />
    </div>
  );
}
