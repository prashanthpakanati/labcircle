// apps/web/lib/order/components/CollectionTypeSelector.tsx

"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { OrderCollectionType } from "../models/enums";
import { Home, Building2, FileText } from "lucide-react";

interface CollectionTypeSelectorProps {
  collectionType: OrderCollectionType;
  notes: string;
  onCollectionTypeChange: (type: OrderCollectionType) => void;
  onNotesChange: (notes: string) => void;
}

export default function CollectionTypeSelector({
  collectionType,
  notes,
  onCollectionTypeChange,
  onNotesChange,
}: CollectionTypeSelectorProps) {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Home className="h-5 w-5 text-amber-500" />
        <CardTitle className="text-base font-semibold">4. Collection Details</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 space-y-4">
        {/* Collection Type Selection */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onCollectionTypeChange(OrderCollectionType.Lab)}
            className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
              collectionType === OrderCollectionType.Lab
                ? "border-primary bg-amber-50/50 text-slate-900 font-semibold shadow-xs"
                : "border-border bg-white text-muted-foreground hover:bg-slate-50"
            }`}
          >
            <Building2 className="h-4 w-4 text-amber-600" />
            Walk-in (Lab)
          </button>

          <button
            type="button"
            onClick={() => onCollectionTypeChange(OrderCollectionType.Home)}
            className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
              collectionType === OrderCollectionType.Home
                ? "border-primary bg-amber-50/50 text-slate-900 font-semibold shadow-xs"
                : "border-border bg-white text-muted-foreground hover:bg-slate-50"
            }`}
          >
            <Home className="h-4 w-4 text-amber-600" />
            Home Collection
          </button>
        </div>

        {/* Optional Notes */}
        <div className="space-y-1">
          <label htmlFor="order-notes" className="text-xs font-medium text-slate-700 flex items-center gap-1">
            <FileText className="h-3.5 w-3.5 text-slate-400" />
            Optional Notes
          </label>
          <textarea
            id="order-notes"
            rows={3}
            placeholder="Add special instructions or clinical notes..."
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </CardContent>
    </Card>
  );
}
