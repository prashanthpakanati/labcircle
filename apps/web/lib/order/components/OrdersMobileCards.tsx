// apps/web/lib/order/components/OrdersMobileCards.tsx

import React from "react";
import { Order } from "../models/types";
import { Patient } from "../../patient/models/types";
import OrderStatusBadge from "./OrderStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";
import OrderRowActions from "./OrderRowActions";
import { OrderCollectionType } from "../models/enums";
import { Card, CardContent } from "@/components/ui/card";

interface OrdersMobileCardsProps {
  orders: Order[];
  patientMap: Map<string, Patient>;
}

export default function OrdersMobileCards({ orders, patientMap }: OrdersMobileCardsProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
  };

  return (
    <div className="space-y-4 md:hidden">
      {orders.map((order) => {
        const patient = patientMap.get(order.patientId);
        const patientName = patient ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient";
        const patientPhone = patient ? patient.phone : "";

        return (
          <Card key={order.id} className="border-border">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-slate-900">{order.displayId}</span>
                <span className="text-xs text-muted-foreground font-mono">{formatDate(order.createdAt)}</span>
              </div>

              <div>
                <span className="font-semibold text-sm text-slate-900 block">{patientName}</span>
                {patientPhone && (
                  <span className="text-xs text-muted-foreground font-mono">{patientPhone}</span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <OrderStatusBadge status={order.status} />
                <PaymentStatusBadge status={order.paymentStatus} />
                <span className="bg-slate-100 text-slate-800 text-[10px] px-2 py-0.5 rounded font-medium">
                  {order.collectionType === OrderCollectionType.Home ? "Home Collection" : "Walk-in"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase block">Total</span>
                  <span className="font-bold text-sm text-slate-900">₹{order.total.toLocaleString()}</span>
                </div>
                <OrderRowActions orderId={order.id} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
