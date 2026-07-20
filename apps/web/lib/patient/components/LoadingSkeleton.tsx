import React from "react";
import { Skeleton } from "@/components/ui/loading";

export default function LoadingSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
