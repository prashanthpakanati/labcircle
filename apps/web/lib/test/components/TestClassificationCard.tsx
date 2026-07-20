// apps/web/lib/test/components/TestClassificationCard.tsx

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Test } from "../models/types";
import { Layers } from "lucide-react";

interface TestClassificationCardProps {
  test: Test;
}

export default function TestClassificationCard({ test }: TestClassificationCardProps) {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Layers className="h-5 w-5 text-indigo-500" />
        <CardTitle className="text-base font-semibold">Classification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs text-muted-foreground block">Department</span>
            <span className="font-medium text-slate-900">{test.department}</span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Category</span>
            <span className="font-medium text-slate-900">{test.category}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
