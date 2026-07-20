// lib/patient/hooks/useCreatePatient.ts

"use client";

import { useState, useCallback } from "react";
import { PatientService } from "../services/PatientService";
import { PatientMapper } from "../models/form";
import { validatePatient } from "../validation/validatePatient";
import { PatientFormData } from "../models/form";
import { Patient } from "../models/types";

export function useCreatePatient() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const createPatient = useCallback(async (form: PatientFormData): Promise<Patient | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const validation = validatePatient(form);
      if (!validation.isValid) {
        // Throw a generic validation error without attaching details
        throw new Error("Validation failed");
      }
      // Convert form data to Patient model; service will add id, timestamps, etc.
      const patient = PatientMapper.toPatient(form);
      const service = new PatientService();
      const created = await service.createPatient(patient);
      setSuccess(true);
      return created;
    } catch (e) {
      setError(e as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createPatient, loading, error, success } as const;
}
