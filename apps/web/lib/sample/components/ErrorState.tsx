// apps/web/lib/sample/components/ErrorState.tsx

"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="p-8 border border-destructive/20 bg-destructive/5 rounded-lg text-center space-y-4 max-w-lg mx-auto my-12">
      <div className="p-3 bg-destructive/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-destructive">
        <AlertCircle className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-destructive">Failed to Load Sample</h3>
        <p className="text-xs text-muted-foreground font-mono">
          {error.message || "An unexpected error occurred while fetching sample data."}
        </p>
      </div>
      <div className="flex items-center justify-center gap-3 pt-2">
        <Link href="/samples" passHref legacyBehavior>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Samples
          </Button>
        </Link>
        {onRetry && (
          <Button onClick={onRetry} size="sm" className="gap-1.5 text-xs">
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
