// apps/web/lib/order/components/OrderDetailsHeader.tsx

"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Edit, Printer, Ban, TestTube } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderStatusBadge from "./OrderStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";
import { Order } from "../models/types";

interface OrderDetailsHeaderProps {
  order: Order;
}

export default function OrderDetailsHeader({ order }: OrderDetailsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center justify-between">
        <Link
          href="/orders"
          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-slate-800 transition-colors"
          aria-label="Back to Orders"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Orders
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-6 rounded-lg border border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl font-bold text-slate-900">{order.displayId}</span>
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
          <p className="text-xs text-muted-foreground">
            Created on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/orders/${order.id}/edit`} passHref legacyBehavior>
            <Button variant="outline" size="sm" className="gap-1.5" aria-label="Edit Order">
              <Edit className="h-4 w-4" />
              Edit Order
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled
            title="Available in future milestone"
            aria-label="Cancel Order (disabled)"
          >
            <Ban className="h-4 w-4" />
            Cancel Order
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled
            title="Available in future milestone"
            aria-label="Print Order (disabled)"
          >
            <Printer className="h-4 w-4" />
            Print Order
          </Button>

          <Button
            variant="primary"
            size="sm"
            className="gap-1.5"
            disabled
            title="Available in future milestone"
            aria-label="Proceed to Sample Collection (disabled)"
          >
            <TestTube className="h-4 w-4" />
            Proceed to Sample Collection
          </Button>
        </div>
      </div>
    </div>
  );
}
