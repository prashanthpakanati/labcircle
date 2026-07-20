// apps/web/lib/sample/components/SampleItemsCard.tsx

"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SampleItem } from "../models/types";
import { TestTube, FlaskConical } from "lucide-react";

interface SampleItemsCardProps {
  items: SampleItem[];
}

export default function SampleItemsCard({ items }: SampleItemsCardProps) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-base font-semibold">Sample Items</CardTitle>
          </div>
          <Badge variant="secondary" className="font-mono text-xs">
            {items.length} Item{items.length === 1 ? "" : "s"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-1">
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-2">
            No sample items associated with this sample.
          </p>
        ) : (
          <div className="divide-y border border-slate-200 rounded-lg overflow-hidden bg-white">
            {items.map((item, index) => (
              <div
                key={`${item.testId}-${index}`}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 transition-colors text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="font-bold text-slate-900 text-sm">{item.testName}</span>
                    <Badge variant="outline" className="font-mono text-[10px] py-0 px-1.5">
                      {item.testCode}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-[11px] font-mono pl-6">
                    Test ID: {item.testId}
                  </p>
                </div>

                <div className="flex items-center gap-3 pl-6 sm:pl-0 pt-1 sm:pt-0">
                  <div className="bg-slate-100 px-2.5 py-1 rounded text-slate-700 text-right">
                    <span className="text-[10px] text-muted-foreground block uppercase font-mono">Sample</span>
                    <span className="font-semibold">{item.sampleType}</span>
                  </div>
                  <div className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded text-right border border-emerald-100">
                    <span className="text-[10px] text-emerald-600 block uppercase font-mono">Container</span>
                    <span className="font-semibold">{item.containerType}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
