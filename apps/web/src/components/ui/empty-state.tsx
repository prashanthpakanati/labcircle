import React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, title, description, icon, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "border-border flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed bg-slate-50/50 p-8 text-center",
          className,
        )}
        {...props}
      >
        {icon && <div className="mb-4 text-slate-400">{icon}</div>}
        <h3 className="mb-1 text-sm font-semibold text-slate-900">{title}</h3>
        <p className="mb-6 max-w-xs text-xs leading-relaxed text-slate-500">{description}</p>
        {action && <div className="flex items-center justify-center">{action}</div>}
      </div>
    );
  },
);
EmptyState.displayName = "EmptyState";
