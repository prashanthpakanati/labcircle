// apps/web/app/tests/new/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TestHeader from "../../../lib/test/components/TestHeader";
import TestForm, { FullTestFormState } from "../../../lib/test/components/TestForm";
import { useCreateTest } from "../../../lib/test/hooks/useCreateTest";
import { TestService } from "../../../lib/test/services/TestService";

export default function CreateTestPage() {
  const router = useRouter();
  const { createTest, loading, error } = useCreateTest();
  const [existingCodes, setExistingCodes] = useState<string[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);

  // Load existing test codes for client-side duplicate validation
  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const service = new TestService();
        const tests = await service.listTests();
        setExistingCodes(tests.map((t: { code: string }) => t.code.trim().toUpperCase()));
      } catch (e) {
        console.error("Failed to fetch existing test codes:", e);
      }
    };
    fetchCodes();
  }, []);

  const handleSubmit = async (data: FullTestFormState) => {
    setServerError(null);
    const created = await createTest(data);
    if (created) {
      router.push(`/tests/${created.id}`);
    } else {
      setServerError(error?.message ?? "Failed to create test. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <TestHeader />
      <TestForm
        onSubmit={handleSubmit}
        isSubmitting={loading}
        existingCodes={existingCodes}
        serverError={serverError}
        submitText="Create Test"
        onCancel={() => router.push("/tests")}
      />
    </div>
  );
}
