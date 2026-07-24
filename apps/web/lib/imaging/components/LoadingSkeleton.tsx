// apps/web/lib/imaging/components/LoadingSkeleton.tsx

import React from "react";

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search Bar Skeleton */}
      <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />

      {/* Grid of Cards Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="border border-slate-200 rounded-xl overflow-hidden flex flex-col h-80 space-y-4"
          >
            <div className="h-44 bg-slate-200 animate-pulse" />
            <div className="p-4 flex-1 space-y-3">
              <div className="h-4 bg-slate-200 rounded w-2/3 animate-pulse" />
              <div className="h-3 bg-slate-200 rounded w-full animate-pulse" />
              <div className="h-3 bg-slate-200 rounded w-5/6 animate-pulse" />
              <div className="flex justify-between items-center pt-4">
                <div className="h-3 bg-slate-200 rounded w-1/4 animate-pulse" />
                <div className="h-3 bg-slate-200 rounded w-1/3 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
