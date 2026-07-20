// apps/web/app/tests/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import TestHeader from "../../lib/test/components/TestHeader";
import TestStatistics from "../../lib/test/components/TestStatistics";
import LoadingSkeleton from "../../lib/test/components/LoadingSkeleton";
import ErrorState from "../../lib/test/components/ErrorState";
import { useTestStats } from "../../lib/test/hooks/useTestStats";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function TestDashboardPage() {
  const { stats, loading, error } = useTestStats();

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <TestHeader />
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <TestHeader />
        <ErrorState error={error} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <TestHeader />
      
      <TestStatistics stats={stats} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Catalog Operations</CardTitle>
            <CardDescription>View, filter, and manage diagnostic tests in the system catalog.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Access the complete test database to manage internal parameters, view pricing configurations, and modify status parameters.
            </p>
            <Link href="/tests/list" passHref legacyBehavior>
              <Button className="w-full md:w-auto" variant="primary">
                View Full Catalog
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Quick Insights</CardTitle>
            <CardDescription>Overall catalog distribution metrics.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Average Turnaround Time (TAT)</span>
              <span className="font-semibold text-slate-700">24 - 48 Hours</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Home Collection Eligible Tests</span>
              <span className="font-semibold text-slate-700">Active</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Supported Classifications</span>
              <span className="font-semibold text-slate-700">Routine, Special, Profile, Package</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
