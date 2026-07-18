import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "destructive" | "outline";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none";

    const variantStyles = {
      primary: "bg-primary/10 text-slate-800 border border-primary/20",
      secondary: "bg-slate-100 text-slate-800 border border-slate-200",
      success: "bg-green-500/10 text-green-700 border border-green-500/20",
      warning: "bg-amber-500/10 text-amber-700 border border-amber-500/20",
      destructive: "bg-red-500/10 text-red-700 border border-red-500/20",
      outline: "text-foreground border border-border bg-transparent",
    };

    return (
      <span ref={ref} className={cn(baseStyles, variantStyles[variant], className)} {...props} />
    );
  },
);
Badge.displayName = "Badge";
