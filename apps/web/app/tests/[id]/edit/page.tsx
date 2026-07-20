// apps/web/app/tests/[id]/edit/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useTest } from "../../../../lib/test/hooks/useTest";
import { useUpdateTest } from "../../../../lib/test/hooks/useUpdateTest";
import { useTests } from "../../../../lib/test/hooks/useTests";
import TestForm, { FullTestFormState } from "../../../../lib/test/components/TestForm";
import LoadingSkeleton from "../../../../lib/test/components/LoadingSkeleton";
import ErrorState from "../../../../lib/test/components/ErrorState";
import EmptyState from "../../../../lib/test/components/EmptyState";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface EditTestPageProps {
  params: Promise<{ id: string }>;
}

export default function EditTestPage({ params }: EditTestPageProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const { data: test, loading: loadingTest, error: testError } = useTest(resolvedParams.id);
  const { updateTest, loading: saving, error: updateError } = useUpdateTest();
  const { data: allTests } = useTests();

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Exclude current test's code from duplicate check list
  const existingCodes = useMemo(() => {
    if (!allTests || !test) return [];
    return allTests
      .filter((t) => t.id !== test.id)
      .map((t) => t.code.toUpperCase());
  }, [allTests, test]);

  const handleSubmit = async (formData: FullTestFormState) => {
    if (!test) return;
    await updateTest(test.id, formData);
    setSuccessMsg(`Test "${formData.name}" (${test.displayId}) successfully updated!`);
    setTimeout(() => {
      router.push(`/tests/${test.id}`);
    }, 1000);
  };

  const handleCancel = () => {
    if (test) {
      router.push(`/tests/${test.id}`);
    } else {
      router.push("/tests/list");
    }
  };

  if (loadingTest) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <LoadingSkeleton />
      </div>
    );
  }

  if (testError) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <ErrorState error={testError} />
      </div>
    );
  }

  if (!test) {
    return (
      <div className="p-6 max-w-4xl mx-auto py-12 border border-dashed rounded-lg">
        <EmptyState
          title="Test Not Found"
          description={`The test with ID "${resolvedParams.id}" was not found.`}
          action={
            <Link href="/tests/list" passHref legacyBehavior>
              <Button variant="outline" size="sm">
                Back to Test List
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <Link
          href={`/tests/${test.id}`}
          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-slate-800 transition-colors"
          aria-label="Back to Test Details"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          Back to Test Details ({test.displayId})
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Edit Test: {test.name} ({test.displayId})
        </h1>
        <p className="text-sm text-muted-foreground">
          Update test configuration, turnaround times, and pricing models.
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
        initialValues={test}
        onSubmit={handleSubmit}
        isSubmitting={saving}
        submitText="Save Changes"
        onCancel={handleCancel}
        serverError={updateError?.message}
        existingCodes={existingCodes}
      />
    </div>
  );
}
