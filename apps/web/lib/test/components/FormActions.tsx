// apps/web/lib/test/components/FormActions.tsx

import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isSubmitting?: boolean;
  submitText?: string;
  onCancel?: () => void;
  disabled?: boolean;
}

export default function FormActions({
  isSubmitting = false,
  submitText = "Save Test",
  onCancel,
  disabled = false,
}: FormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      )}
      <Button
        type="submit"
        variant="primary"
        isLoading={isSubmitting}
        disabled={disabled || isSubmitting}
      >
        {submitText}
      </Button>
    </div>
  );
}
