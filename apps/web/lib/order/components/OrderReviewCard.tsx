// apps/web/lib/order/components/OrderReviewCard.tsx

"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Patient } from "../../patient/models/types";
import { OrderItem } from "../models/types";
import { OrderCollectionType } from "../models/enums";
import { calculateOrderPricing } from "../utils/calculatePricing";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface OrderReviewCardProps {
  patient: Patient | null;
  items: OrderItem[];
  collectionType: OrderCollectionType;
  notes: string;
  discount: number;
  isSubmitting?: boolean;
  onSubmit: () => void;
  serverError?: string | null;
}

export default function OrderReviewCard({
  patient,
  items,
  collectionType,
  notes,
  discount,
  isSubmitting = false,
  onSubmit,
  serverError,
}: OrderReviewCardProps) {
  const { total } = calculateOrderPricing(items, discount);
  const isValidToSubmit = patient !== null && items.length > 0 && total >= 0;

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <CheckCircle className="h-5 w-5 text-emerald-500" />
        <CardTitle className="text-base font-semibold">5. Review & Submit</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 space-y-4">
        {serverError && (
          <Alert variant="error">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-md border border-slate-200">
          <div className="flex justify-between">
            <span className="text-muted-foreground font-medium">Patient:</span>
            <span className="font-semibold text-slate-900">
              {patient ? `${patient.firstName} ${patient.lastName} (${patient.displayId})` : "Not selected"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground font-medium">Tests Selected:</span>
            <span className="font-semibold text-slate-900">{items.length} test(s)</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground font-medium">Collection Mode:</span>
            <span className="font-semibold text-slate-900">
              {collectionType === OrderCollectionType.Home ? "Home Collection" : "Walk-in (Lab)"}
            </span>
          </div>

          {notes.trim() && (
            <div className="flex justify-between">
              <span className="text-muted-foreground font-medium">Notes:</span>
              <span className="font-normal text-slate-800 italic truncate max-w-[200px]">{notes}</span>
            </div>
          )}

          <div className="flex justify-between border-t border-slate-200 pt-2 font-medium">
            <span>Total Payable:</span>
            <span className="font-bold text-sm text-emerald-600">₹{total.toLocaleString()}</span>
          </div>
        </div>

        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onSubmit}
          disabled={!isValidToSubmit || isSubmitting}
          isLoading={isSubmitting}
          className="w-full font-bold"
        >
          Create Order
        </Button>
      </CardContent>
    </Card>
  );
}
