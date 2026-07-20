// apps/web/app/tests/[id]/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useTest } from "../../../lib/test/hooks/useTest";
import TestDetailsHeader from "../../../lib/test/components/TestDetailsHeader";
import TestOverviewCard from "../../../lib/test/components/TestOverviewCard";
import TestClassificationCard from "../../../lib/test/components/TestClassificationCard";
import TestLaboratoryCard from "../../../lib/test/components/TestLaboratoryCard";
import TestPricingCard from "../../../lib/test/components/TestPricingCard";
import TestTatCard from "../../../lib/test/components/TestTatCard";
import TestAuditCard from "../../../lib/test/components/TestAuditCard";
import LoadingSkeleton from "../../../lib/test/components/LoadingSkeleton";
import ErrorState from "../../../lib/test/components/ErrorState";
import EmptyState from "../../../lib/test/components/EmptyState";
import { Button } from "@/components/ui/button";

interface TestDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function TestDetailsPage({ params }: TestDetailsPageProps) {
  const resolvedParams = React.use(params);
  const { data: test, loading, error, refetch } = useTest(resolvedParams.id);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-4">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-4">
        <ErrorState error={error} />
      </div>
    );
  }

  if (!test) {
    return (
      <div className="p-6 max-w-7xl mx-auto py-12 border border-dashed rounded-lg">
        <EmptyState
          title="Test Not Found"
          description={`The diagnostic test with ID "${resolvedParams.id}" does not exist in the catalog.`}
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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <TestDetailsHeader test={test} onRefresh={refetch} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <TestOverviewCard test={test} />
          <TestLaboratoryCard test={test} />
          <TestPricingCard test={test} />
        </div>
        <div className="space-y-6">
          <TestClassificationCard test={test} />
          <TestTatCard test={test} />
          <TestAuditCard test={test} />
        </div>
      </div>
    </div>
  );
}
