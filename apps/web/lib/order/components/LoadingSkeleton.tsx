// apps/web/lib/order/components/LoadingSkeleton.tsx

import React from "react";

export default function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-slate-200 rounded-md w-1/3"></div>
      <div className="h-24 bg-slate-200 rounded-md w-full"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-48 bg-slate-200 rounded-md"></div>
        <div className="h-48 bg-slate-200 rounded-md"></div>
      </div>
    </div>
  );
}
