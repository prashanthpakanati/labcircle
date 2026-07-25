// apps/web/lib/providerAvailability/components/LoadingSkeleton.tsx

import React from "react";

export default function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 bg-slate-200 rounded w-1/3" />
      <div className="h-24 bg-slate-100 rounded-xl w-full" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-16 bg-slate-100 rounded-xl" />
        <div className="h-16 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}
