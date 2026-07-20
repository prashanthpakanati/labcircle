// lib/patient/hooks/useUpdatePatient.ts

"use client";

import { useState, useCallback } from "react";
import { PatientService } from "../services/PatientService";
import { validatePatient } from "../validation/validatePatient";
import { PatientFormData } from "../models/form";

export function useUpdatePatient() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const updatePatient = useCallback(
    async (id: string, form: PatientFormData): Promise<void> => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const validation = validatePatient(form);
        if (!validation.isValid) {
          throw new Error("Validation failed");
        }
        // Map the form to a Patient object (overrides not needed here)
        const service = new PatientService();
        await service.updatePatient(id, form);
        setSuccess(true);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { updatePatient, loading, error, success } as const;
}
