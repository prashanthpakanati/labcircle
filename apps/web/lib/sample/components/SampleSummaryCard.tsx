// apps/web/lib/sample/components/SampleSummaryCard.tsx

"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sample } from "../models/types";
import { Order } from "../../order/models/types";
import { Patient } from "../../patient/models/types";
import SampleStatusBadge from "./SampleStatusBadge";
import { TestTube2, User, FileText, Syringe, UserCheck, MapPin } from "lucide-react";

interface SampleSummaryCardProps {
  sample: Sample;
  order: Order | null;
  patient: Patient | null;
}

export default function SampleSummaryCard({
  sample,
  order,
  patient,
}: SampleSummaryCardProps) {
  const patientDisplayName = patient
    ? `${patient.firstName} ${patient.lastName}`
    : `Patient ID: ${sample.patientId}`;

  const orderDisplayName = order ? order.displayId : sample.orderId;

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TestTube2 className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-base font-semibold">Sample Summary</CardTitle>
          </div>
          <SampleStatusBadge status={sample.status} />
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-100">
          <TestTube2 className="h-4 w-4 text-slate-500 mt-0.5" />
          <div>
            <span className="text-muted-foreground block text-[11px]">Sample ID</span>
            <span className="font-mono font-bold text-slate-900 text-sm">
              {sample.displayId}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-100">
          <FileText className="h-4 w-4 text-slate-500 mt-0.5" />
          <div>
            <span className="text-muted-foreground block text-[11px]">Order Reference</span>
            <span className="font-mono font-semibold text-slate-900">
              {orderDisplayName}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-100">
          <User className="h-4 w-4 text-blue-500 mt-0.5" />
          <div>
            <span className="text-muted-foreground block text-[11px]">Patient</span>
            <span className="font-semibold text-slate-900">
              {patientDisplayName}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-100">
          <MapPin className="h-4 w-4 text-emerald-500 mt-0.5" />
          <div>
            <span className="text-muted-foreground block text-[11px]">Collection Location</span>
            <span className="font-semibold text-slate-900">
              {sample.collectionType}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-100">
          <UserCheck className="h-4 w-4 text-purple-500 mt-0.5" />
          <div>
            <span className="text-muted-foreground block text-[11px]">Collector Type</span>
            <span className="font-semibold text-slate-900">
              {sample.collectorType}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-100">
          <Syringe className="h-4 w-4 text-amber-500 mt-0.5" />
          <div>
            <span className="text-muted-foreground block text-[11px]">Collector ID / Name</span>
            <span className="font-mono font-semibold text-slate-900">
              {sample.collectorId || "Unassigned"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
