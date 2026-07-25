// apps/web/lib/fulfillment/components/FulfillmentStatusBadge.tsx

import React from "react";
import { FulfillmentStatus } from "../models/enums";

interface FulfillmentStatusBadgeProps {
  status: FulfillmentStatus;
}

export default function FulfillmentStatusBadge({ status }: FulfillmentStatusBadgeProps) {
  let colorStyle = "bg-slate-100 text-slate-700 border-slate-200";

  switch (status) {
    case FulfillmentStatus.BOOKED:
    case FulfillmentStatus.FULFILLMENT_CREATED:
      colorStyle = "bg-blue-50 text-blue-700 border-blue-200";
      break;
    case FulfillmentStatus.TECHNICIAN_ASSIGNED:
    case FulfillmentStatus.TECHNICIAN_ACCEPTED:
    case FulfillmentStatus.TECHNICIAN_EN_ROUTE:
      colorStyle = "bg-amber-50 text-amber-700 border-amber-200";
      break;
    case FulfillmentStatus.ARRIVED:
    case FulfillmentStatus.OTP_VERIFIED:
      colorStyle = "bg-indigo-50 text-indigo-700 border-indigo-200";
      break;
    case FulfillmentStatus.SAMPLE_COLLECTED:
    case FulfillmentStatus.SAMPLE_PACKED:
    case FulfillmentStatus.IN_TRANSIT_TO_LAB:
      colorStyle = "bg-purple-50 text-purple-700 border-purple-200";
      break;
    case FulfillmentStatus.LAB_RECEIVED:
    case FulfillmentStatus.PROCESSING:
    case FulfillmentStatus.REPORT_READY:
      colorStyle = "bg-cyan-50 text-cyan-700 border-cyan-200";
      break;
    case FulfillmentStatus.COMPLETED:
      colorStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
      break;
    case FulfillmentStatus.CANCELLED:
    case FulfillmentStatus.FAILED:
    case FulfillmentStatus.NO_SHOW:
      colorStyle = "bg-rose-50 text-rose-700 border-rose-200";
      break;
    case FulfillmentStatus.RESCHEDULED:
      colorStyle = "bg-orange-50 text-orange-700 border-orange-200";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorStyle}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
