// apps/web/lib/sample/components/AuditInformationCard.tsx

"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sample } from "../models/types";
import { Clock, User, ShieldCheck } from "lucide-react";

interface AuditInformationCardProps {
  sample: Sample;
}

function formatDate(isoStr?: string): string {
  if (!isoStr) return "N/A";
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function AuditInformationCard({ sample }: AuditInformationCardProps) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-slate-600" />
          <CardTitle className="text-base font-semibold">Audit Information</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2.5 bg-slate-50 rounded border border-slate-100 space-y-0.5">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> Created At
            </span>
            <span className="font-mono text-slate-800 block text-[11px]">
              {formatDate(sample.createdAt)}
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded border border-slate-100 space-y-0.5">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> Updated At
            </span>
            <span className="font-mono text-slate-800 block text-[11px]">
              {formatDate(sample.updatedAt)}
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded border border-slate-100 space-y-0.5">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <User className="h-3 w-3" /> Created By
            </span>
            <span className="font-medium text-slate-700 block text-[11px]">
              System Administrator (Automated)
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded border border-slate-100 space-y-0.5">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <User className="h-3 w-3" /> Updated By
            </span>
            <span className="font-medium text-slate-700 block text-[11px]">
              System Administrator (Automated)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
