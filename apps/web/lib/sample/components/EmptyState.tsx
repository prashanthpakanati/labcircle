// apps/web/lib/sample/components/EmptyState.tsx

"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TestTube2, ArrowLeft } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "Sample Not Found",
  description = "The requested sample record could not be found or does not exist.",
}: EmptyStateProps) {
  return (
    <div className="p-12 border border-dashed rounded-lg text-center space-y-4 max-w-lg mx-auto my-12 bg-white">
      <div className="p-3 bg-slate-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-slate-500">
        <TestTube2 className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Link href="/samples" passHref legacyBehavior>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Samples List
        </Button>
      </Link>
    </div>
  );
}
