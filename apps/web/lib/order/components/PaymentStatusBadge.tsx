// apps/web/lib/order/components/PaymentStatusBadge.tsx

import React from "react";
import { PaymentStatus } from "../models/enums";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export default function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const getBadgeStyle = (st: PaymentStatus) => {
    switch (st) {
      case PaymentStatus.Paid:
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case PaymentStatus.Partial:
        return "bg-purple-100 text-purple-800 border-purple-200";
      case PaymentStatus.Unpaid:
        return "bg-amber-100 text-amber-800 border-amber-200";
      case PaymentStatus.Refunded:
        return "bg-slate-100 text-slate-800 border-slate-200";
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
