// apps/web/lib/sample/components/CollectionInformationCard.tsx

"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sample } from "../models/types";
import { Syringe, MapPin, UserCheck, StickyNote, Clock } from "lucide-react";

interface CollectionInformationCardProps {
  sample: Sample;
}

function formatDate(isoStr?: string): string {
  if (!isoStr) return "Not recorded";
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return "Invalid Date";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CollectionInformationCard({
  sample,
}: CollectionInformationCardProps) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Syringe className="h-5 w-5 text-emerald-600" />
          <CardTitle className="text-base font-semibold">Collection Information</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
              <MapPin className="h-3.5 w-3.5" /> Collection Type
            </span>
            <span className="font-semibold text-slate-900 block">{sample.collectionType}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
              <UserCheck className="h-3.5 w-3.5" /> Collector Type
            </span>
            <span className="font-semibold text-slate-900 block">{sample.collectorType}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
              <Syringe className="h-3.5 w-3.5" /> Collector ID / Name
            </span>
            <span className="font-mono font-semibold text-slate-900 block">
              {sample.collectorId || "Unassigned"}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
              <Clock className="h-3.5 w-3.5" /> Collected At
            </span>
            <span className="font-medium text-slate-900 block">
              {formatDate(sample.collectedAt)}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1 sm:col-span-2">
            <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
              <Clock className="h-3.5 w-3.5" /> Received At Lab
            </span>
            <span className="font-medium text-slate-900 block">
              {formatDate(sample.receivedAtLabAt)}
            </span>
          </div>
        </div>

        {/* Collection Notes */}
        {sample.notes ? (
          <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200/60 space-y-1">
            <span className="font-semibold text-amber-900 flex items-center gap-1 text-[11px]">
              <StickyNote className="h-3.5 w-3.5 text-amber-700" /> Collection Notes
            </span>
            <p className="text-amber-950 whitespace-pre-wrap">{sample.notes}</p>
          </div>
        ) : (
          <p className="text-muted-foreground italic text-[11px]">No collection notes provided.</p>
        )}
      </CardContent>
    </Card>
  );
}
