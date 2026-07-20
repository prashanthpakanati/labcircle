// apps/web/lib/order/components/OrderAuditCard.tsx

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Order } from "../models/types";
import { Calendar } from "lucide-react";

interface OrderAuditCardProps {
  order: Order;
}

export default function OrderAuditCard({ order }: OrderAuditCardProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr || typeof dateStr !== "string" || !dateStr.trim()) return "N/A";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "N/A" : d.toLocaleString();
  };

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Calendar className="h-5 w-5 text-slate-500" />
        <CardTitle className="text-base font-semibold">Audit Logs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs text-muted-foreground block">Created At</span>
            <span className="font-mono text-xs text-slate-700">{formatDate(order.createdAt)}</span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Last Updated At</span>
            <span className="font-mono text-xs text-slate-700">{formatDate(order.updatedAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
