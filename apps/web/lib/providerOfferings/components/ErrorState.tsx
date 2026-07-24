// apps/web/lib/providerOfferings/components/ErrorState.tsx

import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

/** Error state displayed when a Provider Offering operation fails. */
export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-rose-50 border border-rose-100 rounded-xl text-center max-w-lg mx-auto">
      <div className="p-3 bg-rose-100 text-rose-600 rounded-full mb-4">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-semibold text-rose-800">Something went wrong</h3>
      <p className="text-xs text-rose-600 mt-1 max-w-xs">{message || "Failed to load offerings."}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}
