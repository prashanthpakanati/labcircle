// apps/web/lib/providerOfferings/components/EmptyState.tsx

import React from "react";
import { FlaskConical } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

/** Empty state shown when no Provider Offerings match the current filters. */
export default function EmptyState({
  title = "No Offerings Found",
  description = "There are no offerings listed for this location yet.",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-xl text-center shadow-sm max-w-lg mx-auto">
      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full mb-4">
        <FlaskConical className="h-6 w-6 animate-pulse" />
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-xs">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
