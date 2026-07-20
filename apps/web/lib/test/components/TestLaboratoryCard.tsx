// apps/web/lib/test/components/TestLaboratoryCard.tsx

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Test } from "../models/types";
import { FlaskConical } from "lucide-react";

interface TestLaboratoryCardProps {
  test: Test;
}

export default function TestLaboratoryCard({ test }: TestLaboratoryCardProps) {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <FlaskConical className="h-5 w-5 text-emerald-500" />
        <CardTitle className="text-base font-semibold">Laboratory Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-xs text-muted-foreground block">Specimen Type</span>
            <span className="font-medium text-slate-900">{test.specimenType}</span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Method</span>
            <span className="font-medium text-slate-900">{test.method}</span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block mb-1">Home Collection</span>
            <Badge variant={test.homeCollection ? "success" : "outline"}>
              {test.homeCollection ? "Available" : "Lab Only"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
