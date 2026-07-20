// apps/web/lib/order/components/EmptyState.tsx

import React from "react";
import { AlertCircle } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  title = "Order Not Found",
  description = "The requested order document could not be found.",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
      <div className="p-3 bg-slate-100 rounded-full text-slate-500">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="font-semibold text-lg text-slate-800">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
