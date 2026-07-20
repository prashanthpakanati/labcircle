// apps/web/lib/sample/components/GeneratedSampleItemsCard.tsx

"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SampleItem } from "../models/types";
import { TestTube, FlaskConical } from "lucide-react";

interface GeneratedSampleItemsCardProps {
  items: SampleItem[];
  onUpdateItem?: (index: number, updatedItem: SampleItem) => void;
  error?: string;
}

export default function GeneratedSampleItemsCard({
  items,
  onUpdateItem,
  error,
}: GeneratedSampleItemsCardProps) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-base font-semibold">2. Generated Sample Items</CardTitle>
          </div>
          <Badge variant="secondary" className="font-mono">
            {items.length} Item{items.length === 1 ? "" : "s"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Auto-generated from OrderItem snapshots. Verify or update specimen and container details.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 pt-1">
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-2">
            No sample items generated yet. Select an order to generate items.
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={`${item.testId}-${index}`}
                className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-emerald-600" />
                    <span className="font-semibold text-sm text-slate-900">{item.testName}</span>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    {item.testCode}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor={`sampleType-${index}`}
                      className="block text-xs font-medium text-slate-700 mb-1"
                    >
                      Sample Type
                    </label>
                    {onUpdateItem ? (
                      <Input
                        id={`sampleType-${index}`}
                        value={item.sampleType}
                        onChange={(e) =>
                          onUpdateItem(index, { ...item, sampleType: e.target.value })
                        }
                        placeholder="e.g. Whole Blood, Serum, Urine"
                        className="h-8 text-xs bg-white"
                      />
                    ) : (
                      <p className="text-xs font-medium text-slate-800">{item.sampleType}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`containerType-${index}`}
                      className="block text-xs font-medium text-slate-700 mb-1"
                    >
                      Container Type
                    </label>
                    {onUpdateItem ? (
                      <Input
                        id={`containerType-${index}`}
                        value={item.containerType}
                        onChange={(e) =>
                          onUpdateItem(index, { ...item, containerType: e.target.value })
                        }
                        placeholder="e.g. EDTA Tube, SST Tube, Plain Container"
                        className="h-8 text-xs bg-white"
                      />
                    ) : (
                      <p className="text-xs font-medium text-slate-800">{item.containerType}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-xs text-destructive font-medium">{error}</p>}
      </CardContent>
    </Card>
  );
}
