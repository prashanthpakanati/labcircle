import React from "react";
import { cn } from "@/lib/utils";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "warning" | "error" | "success";
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "info", role = "alert", ...props }, ref) => {
    const variantStyles = {
      info: "border-blue-500/20 bg-blue-50/50 text-blue-800 [&>svg]:text-blue-600",
      warning: "border-amber-500/20 bg-amber-50/50 text-amber-800 [&>svg]:text-amber-600",
      error: "border-red-500/20 bg-red-50/50 text-red-800 [&>svg]:text-red-600",
      success: "border-green-500/20 bg-green-50/50 text-green-800 [&>svg]:text-green-600",
    };

    return (
      <div
        ref={ref}
        role={role}
        className={cn(
          "[&>svg]:text-foreground relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:top-4 [&>svg]:left-4 [&>svg~*]:pl-7",
          variantStyles[variant],
          className,
        )}
        {...props}
      />
    );
  },
);
Alert.displayName = "Alert";

export const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  return (
    <h5
      ref={ref}
      className={cn("mb-1 text-sm leading-none font-semibold tracking-tight", className)}
      {...props}
    />
  );
});
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("text-xs opacity-90 [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
});
AlertDescription.displayName = "AlertDescription";
