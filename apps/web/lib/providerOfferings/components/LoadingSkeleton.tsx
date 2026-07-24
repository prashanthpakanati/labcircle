// apps/web/lib/providerOfferings/components/LoadingSkeleton.tsx

import React from "react";

/** Skeleton loader for the Provider Offering list view. */
export default function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 bg-slate-200 rounded w-1/3" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-xl p-5 space-y-3 shadow-sm">
            <div className="flex justify-between">
              <div className="h-4 bg-slate-200 rounded w-2/3" />
              <div className="h-4 bg-slate-200 rounded w-1/5" />
            </div>
            <div className="h-3 bg-slate-200 rounded w-1/2" />
            <div className="h-px bg-slate-100" />
            <div className="grid grid-cols-2 gap-2">
              <div className="h-3 bg-slate-200 rounded" />
              <div className="h-3 bg-slate-200 rounded" />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <div className="h-7 bg-slate-200 rounded w-16" />
              <div className="h-7 bg-slate-200 rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
