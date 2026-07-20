// apps/web/lib/test/components/TestOverviewCard.tsx

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TestStatusBadge from "./TestStatusBadge";
import { Test } from "../models/types";
import { Info } from "lucide-react";

interface TestOverviewCardProps {
  test: Test;
}

export default function TestOverviewCard({ test }: TestOverviewCardProps) {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Info className="h-5 w-5 text-blue-500" />
        <CardTitle className="text-base font-semibold">General Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs text-muted-foreground block">Test Name</span>
            <span className="font-medium text-slate-900">{test.name}</span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Display ID</span>
            <span className="font-mono font-medium text-slate-900">{test.displayId}</span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Test Code</span>
            <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded font-semibold inline-block mt-0.5">
              {test.code}
            </span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block mb-1">Status</span>
            <TestStatusBadge status={test.status} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
