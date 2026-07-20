// apps/web/lib/sample/components/OrderInformationCard.tsx

"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Order } from "../../order/models/types";
import { FileText, Calendar, TestTube2, CreditCard } from "lucide-react";

interface OrderInformationCardProps {
  order: Order | null;
  orderId?: string;
}

export default function OrderInformationCard({
  order,
  orderId,
}: OrderInformationCardProps) {
  if (!order) {
    return (
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-base font-semibold">Order Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground font-mono">
            Order ID: {orderId || "Unknown"}
          </p>
        </CardContent>
      </Card>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-base font-semibold">Order Information</CardTitle>
          </div>
          <span className="text-xs font-mono font-bold text-slate-900">
            {order.displayId}
          </span>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 bg-slate-50 rounded border border-slate-100 space-y-0.5">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Order Date
          </span>
          <span className="font-semibold text-slate-800 block">{orderDate}</span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded border border-slate-100 space-y-0.5">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <TestTube2 className="h-3 w-3" /> Tests Included
          </span>
          <span className="font-semibold text-slate-800 block">
            {order.items.length} Test{order.items.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded border border-slate-100 space-y-0.5">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <CreditCard className="h-3 w-3" /> Total Amount
          </span>
          <span className="font-bold text-slate-900 block">₹{order.total}</span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded border border-slate-100 space-y-0.5">
          <span className="text-[11px] text-muted-foreground">Status</span>
          <span className="font-semibold text-emerald-700 block">{order.status}</span>
        </div>
      </CardContent>
    </Card>
  );
}
