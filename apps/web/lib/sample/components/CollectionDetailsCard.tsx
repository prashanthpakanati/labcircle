// apps/web/lib/sample/components/CollectionDetailsCard.tsx

"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CollectionType, CollectorType } from "../models/enums";
import { Syringe, UserCheck, StickyNote, MapPin } from "lucide-react";

interface CollectionDetailsCardProps {
  collectionType: CollectionType;
  collectorType: CollectorType;
  collectorId: string;
  notes?: string;
  onChangeCollectionType: (val: CollectionType) => void;
  onChangeCollectorType: (val: CollectorType) => void;
  onChangeCollectorId: (val: string) => void;
  onChangeNotes: (val: string) => void;
  errors?: {
    collectionType?: string;
    collectorType?: string;
    collectorId?: string;
  };
}

export default function CollectionDetailsCard({
  collectionType,
  collectorType,
  collectorId,
  notes = "",
  onChangeCollectionType,
  onChangeCollectorType,
  onChangeCollectorId,
  onChangeNotes,
  errors,
}: CollectionDetailsCardProps) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Syringe className="h-5 w-5 text-emerald-600" />
          <CardTitle className="text-base font-semibold">3. Collection Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Collection Type */}
          <div className="space-y-1.5">
            <label
              htmlFor="collectionType"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-800"
            >
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              Collection Type <span className="text-destructive">*</span>
            </label>
            <select
              id="collectionType"
              value={collectionType}
              onChange={(e) => onChangeCollectionType(e.target.value as CollectionType)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value={CollectionType.Lab}>Walk-In (Lab)</option>
              <option value={CollectionType.Home}>Home Collection</option>
              <option value={CollectionType.External}>External Facility</option>
            </select>
            {errors?.collectionType && (
              <p className="text-xs text-destructive">{errors.collectionType}</p>
            )}
          </div>

          {/* Collector Type */}
          <div className="space-y-1.5">
            <label
              htmlFor="collectorType"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-800"
            >
              <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
              Collector Type <span className="text-destructive">*</span>
            </label>
            <select
              id="collectorType"
              value={collectorType}
              onChange={(e) => onChangeCollectorType(e.target.value as CollectorType)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value={CollectorType.Internal}>Phlebotomist (Internal)</option>
              <option value={CollectorType.Patient}>Self Collection (Patient)</option>
              <option value={CollectorType.External}>External Phlebotomist</option>
            </select>
            {errors?.collectorType && (
              <p className="text-xs text-destructive">{errors.collectorType}</p>
            )}
          </div>
        </div>

        {/* Collector ID / Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="collectorId"
            className="block text-xs font-semibold text-slate-800"
          >
            Assigned Collector (ID / Name) <span className="text-destructive">*</span>
          </label>
          <Input
            id="collectorId"
            placeholder="e.g. PHLEB-102 or Collector Name"
            value={collectorId}
            onChange={(e) => onChangeCollectorId(e.target.value)}
            className="h-9 text-sm"
          />
          {errors?.collectorId && (
            <p className="text-xs text-destructive">{errors.collectorId}</p>
          )}
        </div>

        {/* Collection Notes */}
        <div className="space-y-1.5">
          <label
            htmlFor="notes"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-800"
          >
            <StickyNote className="h-3.5 w-3.5 text-muted-foreground" />
            Collection Notes <span className="text-muted-foreground font-normal">(Optional)</span>
          </label>
          <textarea
            id="notes"
            rows={3}
            placeholder="Fasting status, patient condition, special instructions..."
            value={notes}
            onChange={(e) => onChangeNotes(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
          />
        </div>
      </CardContent>
    </Card>
  );
}
