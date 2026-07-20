// apps/web/lib/sample/components/SampleStatusBadge.tsx

"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { SampleStatus } from "../models/enums";

interface SampleStatusBadgeProps {
  status: SampleStatus;
  className?: string;
}

const STATUS_CONFIG: Record<
  SampleStatus,
  { label: string; className: string }
> = {
  [SampleStatus.PendingCollection]: {
    label: "Pending Collection",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  [SampleStatus.Collected]: {
    label: "Collected",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  [SampleStatus.ReceivedAtLab]: {
    label: "Received at Lab",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
  [SampleStatus.Processing]: {
    label: "Processing",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  [SampleStatus.Completed]: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  [SampleStatus.Cancelled]: {
    label: "Cancelled",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

export default function SampleStatusBadge({
  status,
  className = "",
}: SampleStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <Badge
      variant="outline"
      className={`font-semibold text-xs py-0.5 px-2.5 ${config.className} ${className}`}
      aria-label={`Sample status: ${config.label}`}
    >
      {config.label}
    </Badge>
  );
}
