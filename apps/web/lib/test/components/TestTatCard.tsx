// apps/web/lib/test/components/TestTatCard.tsx

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Test } from "../models/types";
import { Clock } from "lucide-react";

interface TestTatCardProps {
  test: Test;
}

export default function TestTatCard({ test }: TestTatCardProps) {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Clock className="h-5 w-5 text-amber-500" />
        <CardTitle className="text-base font-semibold">Turnaround Time (TAT)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs text-muted-foreground block">Normal TAT</span>
            <span className="font-semibold text-slate-900">{test.tatHours} Hours</span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Urgent TAT</span>
            <span className="font-semibold text-amber-600">{test.urgentTatHours} Hours</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
