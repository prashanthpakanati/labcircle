import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ErrorStateProps {
  error: Error | null;
}

export default function ErrorState({ error }: ErrorStateProps) {
  return (
    <Alert variant="error" className="mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error?.message ?? "An unexpected error occurred."}</AlertDescription>
    </Alert>
  );
}
