// apps/web/lib/providerAvailability/components/ErrorState.tsx

import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-rose-50 border border-rose-100 rounded-xl text-center max-w-lg mx-auto">
      <div className="p-2.5 bg-rose-100 text-rose-600 rounded-full mb-3">
        <AlertCircle className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold text-rose-800">Booking Engine Exception</h3>
      <p className="text-xs text-rose-600 mt-1 max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
