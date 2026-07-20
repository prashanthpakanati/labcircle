// apps/web/lib/order/components/OrderStatusBadge.tsx

import React from "react";
import { OrderStatus } from "../models/enums";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const getBadgeStyle = (st: OrderStatus) => {
    switch (st) {
      case OrderStatus.Completed:
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case OrderStatus.Processing:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case OrderStatus.Pending:
        return "bg-amber-100 text-amber-800 border-amber-200";
      case OrderStatus.Cancelled:
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeStyle(
        status
      )}`}
    >
      {status}
    </span>
  );
}
