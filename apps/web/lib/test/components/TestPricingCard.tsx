// apps/web/lib/test/components/TestPricingCard.tsx

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Test } from "../models/types";
import { IndianRupee } from "lucide-react";

interface TestPricingCardProps {
  test: Test;
}

export default function TestPricingCard({ test }: TestPricingCardProps) {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <IndianRupee className="h-5 w-5 text-emerald-500" />
        <CardTitle className="text-base font-semibold">Pricing Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-xs text-muted-foreground block">MRP</span>
            <span className="font-semibold text-slate-900">₹{test.mrp.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">B2B Partner Price</span>
            <span className="font-semibold text-slate-900">₹{test.b2bPrice.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">LabCircle Network Price</span>
            <span className="font-bold text-emerald-600">₹{test.labCirclePrice.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
