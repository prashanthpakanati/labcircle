// apps/web/lib/order/components/ErrorState.tsx

import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  error: Error;
}

export default function ErrorState({ error }: ErrorStateProps) {
  return (
    <Alert variant="error">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error Loading Order</AlertTitle>
      <AlertDescription>{error.message || "An unexpected error occurred while fetching order data."}</AlertDescription>
    </Alert>
  );
}
