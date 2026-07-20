// apps/web/lib/sample/components/SampleReviewCard.tsx

"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Order } from "../../order/models/types";
import { Patient } from "../../patient/models/types";
import { SampleItem } from "../models/types";
import { CollectionType, CollectorType, SampleStatus } from "../models/enums";
import { CheckCircle2, User, FileText, Syringe, TestTube, Loader2, AlertCircle } from "lucide-react";

interface SampleReviewCardProps {
  order: Order | null;
  patient: Patient | null;
  items: SampleItem[];
  collectionType: CollectionType;
  collectorType: CollectorType;
  collectorId: string;
  notes?: string;
  isSubmitting?: boolean;
  serverError?: string | null;
  onSubmit: () => void;
  onCancel?: () => void;
}

export default function SampleReviewCard({
  order,
  patient,
  items,
  collectionType,
  collectorType,
  collectorId,
  notes,
  isSubmitting = false,
  serverError = null,
  onSubmit,
  onCancel,
}: SampleReviewCardProps) {
  if (!order) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold">4. Review & Confirm</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground italic">
            Please select an order to review sample collection details.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-base font-semibold">4. Review & Confirm</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
            Initial Status: {SampleStatus.PendingCollection}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {serverError && (
          <div className="flex items-center gap-2 text-destructive text-xs font-medium bg-destructive/10 p-3 rounded-md border border-destructive/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Patient Summary */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-1">
            <h5 className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
              <User className="h-3.5 w-3.5 text-blue-600" />
              Patient Information
            </h5>
            {patient ? (
              <>
                <p className="font-medium text-slate-900">{patient.firstName} {patient.lastName}</p>
                <p className="text-muted-foreground font-mono">ID: {patient.displayId} • Phone: {patient.phone}</p>
              </>
            ) : (
              <p className="text-muted-foreground">ID: {order.patientId}</p>
            )}
          </div>

          {/* Order Summary */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-1">
            <h5 className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
              <FileText className="h-3.5 w-3.5 text-emerald-600" />
              Order Information
            </h5>
            <p className="font-mono font-medium text-slate-900">ID: {order.displayId}</p>
            <p className="text-muted-foreground">Status: {order.status} • Total: ₹{order.total}</p>
          </div>
        </div>

        {/* Collection Details Summary */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-1 text-xs">
          <h5 className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
            <Syringe className="h-3.5 w-3.5 text-emerald-600" />
            Collection Details
          </h5>
          <div className="grid grid-cols-2 gap-2 text-slate-700">
            <div>Collection Type: <span className="font-medium text-slate-900">{collectionType}</span></div>
            <div>Collector Type: <span className="font-medium text-slate-900">{collectorType}</span></div>
            <div>Collector ID/Name: <span className="font-medium text-slate-900">{collectorId || "Not specified"}</span></div>
            {notes && <div>Notes: <span className="font-medium text-slate-900">{notes}</span></div>}
          </div>
        </div>

        {/* Sample Items Summary */}
        <div className="space-y-2">
          <h5 className="font-semibold text-xs text-slate-800 flex items-center gap-1.5">
            <TestTube className="h-3.5 w-3.5 text-emerald-600" />
            Sample Items ({items.length})
          </h5>
          <div className="divide-y border border-slate-200 rounded-md overflow-hidden bg-white text-xs">
            {items.map((item, idx) => (
              <div key={idx} className="p-2.5 flex items-center justify-between">
                <div>
                  <span className="font-medium text-slate-900">{item.testName}</span>
                  <span className="text-muted-foreground font-mono ml-2">({item.testCode})</span>
                </div>
                <div className="text-muted-foreground text-[11px] font-mono">
                  {item.sampleType} • {item.containerType}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="text-xs"
          >
            Cancel
          </Button>
        )}
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || !order || items.length === 0}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
              Creating Sample...
            </>
          ) : (
            "Create Sample Collection"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
