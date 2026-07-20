// apps/web/lib/order/components/OrderSummaryCard.tsx

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Order } from "../models/types";
import OrderStatusBadge from "./OrderStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";
import { OrderCollectionType } from "../models/enums";
import { ClipboardList } from "lucide-react";

interface OrderSummaryCardProps {
  order: Order;
}

export default function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr || typeof dateStr !== "string" || !dateStr.trim()) return "N/A";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "N/A" : d.toLocaleString();
  };

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <ClipboardList className="h-5 w-5 text-slate-500" />
        <CardTitle className="text-base font-semibold">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs text-muted-foreground block">Order Display ID</span>
            <span className="font-mono text-xs font-bold text-slate-900">{order.displayId}</span>
          </div>

          <div>
            <span className="text-xs text-muted-foreground block">Collection Type</span>
            <span className="font-medium text-xs text-slate-800">
              {order.collectionType === OrderCollectionType.Home ? "Home Collection" : "Walk-in (Lab)"}
            </span>
          </div>

          <div>
            <span className="text-xs text-muted-foreground block mb-1">Order Status</span>
            <OrderStatusBadge status={order.status} />
          </div>

          <div>
            <span className="text-xs text-muted-foreground block mb-1">Payment Status</span>
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>

          <div className="sm:col-span-2">
            <span className="text-xs text-muted-foreground block">Created Date</span>
            <span className="font-mono text-xs text-slate-700">{formatDate(order.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
