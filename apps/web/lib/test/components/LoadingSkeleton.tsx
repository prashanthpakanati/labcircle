// apps/web/lib/test/components/LoadingSkeleton.tsx

import React from "react";
import { Skeleton } from "@/components/ui/loading";

export default function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
