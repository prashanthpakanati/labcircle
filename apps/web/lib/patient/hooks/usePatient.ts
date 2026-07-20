// lib/patient/hooks/usePatient.ts

import { useState, useEffect, useCallback } from "react";
import { Patient } from "../models/types";
import { PatientService } from "../services/PatientService";

/** Hook to fetch a single patient by Firestore document ID. */
export function usePatient(id: string) {
  const [data, setData] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPatient = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const service = new PatientService();
      const patient = await service.getPatient(id);
      setData(patient);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  return { data, loading, error, refetch: fetchPatient };
}
