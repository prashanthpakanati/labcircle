// apps/web/lib/imaging/components/ErrorState.tsx

import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: Error | { message: string };
  onRetry?: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-50/30 border border-red-100 rounded-xl text-center">
      <div className="p-2.5 bg-red-50 text-red-600 rounded-full mb-4">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="font-bold text-red-900 text-sm md:text-base">Failed to load catalog data</h3>
      <p className="text-xs text-red-700/80 max-w-sm mt-1 mb-5">
        {error?.message || "An unexpected error occurred while communicating with the database server."}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="text-xs font-semibold gap-1.5 border-red-200 text-red-800 bg-white hover:bg-red-50"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Retry Connection
        </Button>
      )}
    </div>
  );
}
