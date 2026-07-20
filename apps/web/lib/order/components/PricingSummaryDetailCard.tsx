// apps/web/lib/order/components/PricingSummaryDetailCard.tsx

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { OrderItem } from "../models/types";
import { calculateOrderPricing } from "../utils/calculatePricing";
import { IndianRupee } from "lucide-react";

interface PricingSummaryDetailCardProps {
  items: OrderItem[];
  discount: number;
}

export default function PricingSummaryDetailCard({
  items,
  discount,
}: PricingSummaryDetailCardProps) {
  const { subtotal, discount: effectiveDiscount, tax, homeCollectionFee, total } = calculateOrderPricing(
    items,
    discount
  );

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <IndianRupee className="h-5 w-5 text-emerald-500" />
        <CardTitle className="text-base font-semibold">Pricing Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 space-y-2 text-sm">
        <div className="flex justify-between items-center text-muted-foreground">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-800">₹{subtotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center text-muted-foreground">
          <span>Discount</span>
          <span className="font-medium text-emerald-700">-₹{effectiveDiscount.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center text-muted-foreground">
          <span>Tax</span>
          <span className="font-medium text-slate-800">₹{tax.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center text-muted-foreground">
          <span>Home Collection Fee</span>
          <span className="font-medium text-slate-800">₹{homeCollectionFee.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
          <span>Grand Total</span>
          <span className="text-emerald-600">₹{total.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
