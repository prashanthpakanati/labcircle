import React from "react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, items, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn("flex flex-wrap items-center gap-1.5 text-xs text-slate-500", className)}
        {...props}
      >
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;

          return (
            <React.Fragment key={idx}>
              {item.isCurrent || isLast ? (
                <span className="font-semibold text-slate-800" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <a href={item.href || "#"} className="transition-colors hover:text-slate-800">
                  {item.label}
                </a>
              )}
              {!isLast && (
                <span className="text-slate-400 select-none" aria-hidden="true">
                  /
                </span>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    );
  },
);
Breadcrumb.displayName = "Breadcrumb";
