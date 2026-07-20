// apps/web/lib/order/components/PricingSummaryCard.tsx

"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OrderItem } from "../models/types";
import { calculateOrderPricing } from "../utils/calculatePricing";
import { IndianRupee } from "lucide-react";

interface PricingSummaryCardProps {
  items: OrderItem[];
  discount: number;
  onDiscountChange: (discount: number) => void;
  error?: string;
}

export default function PricingSummaryCard({
  items,
  discount,
  onDiscountChange,
  error,
}: PricingSummaryCardProps) {
  const { subtotal, total } = calculateOrderPricing(items, discount);

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <IndianRupee className="h-5 w-5 text-emerald-500" />
        <CardTitle className="text-base font-semibold">3. Price Calculation</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 space-y-3">
        <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2 gap-4">
          <label htmlFor="order-discount" className="text-muted-foreground flex-1">
            Discount (₹)
          </label>
          <Input
            id="order-discount"
            type="number"
            min="0"
            max={subtotal}
            step="1"
            value={discount === 0 ? "" : discount}
            placeholder="0"
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onDiscountChange(isNaN(val) || val < 0 ? 0 : val);
            }}
            className="h-8 w-24 text-right text-xs"
            aria-label="Discount amount"
          />
        </div>

        {discount > subtotal && subtotal > 0 && (
          <p className="text-[11px] text-amber-600 font-medium">
            Discount capped to subtotal (₹{subtotal.toLocaleString()})
          </p>
        )}

        <div className="flex justify-between items-center pt-1">
          <span className="font-bold text-slate-900 font-semibold">Total Payable</span>
          <span className="text-xl font-bold text-emerald-600">₹{total.toLocaleString()}</span>
        </div>

        {error && <p className="text-xs text-destructive font-medium">{error}</p>}
      </CardContent>
    </Card>
  );
}
