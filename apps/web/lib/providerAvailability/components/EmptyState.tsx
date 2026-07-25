// apps/web/lib/providerAvailability/components/EmptyState.tsx

import React from "react";
import { CalendarX } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "No Schedule Configured",
  description = "No availability or working hours have been set up for this view yet.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-xl text-center shadow-sm max-w-lg mx-auto">
      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full mb-3">
        <CalendarX className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-xs">{description}</p>
    </div>
  );
}
