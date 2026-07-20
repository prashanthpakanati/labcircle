// lib/patient/hooks/usePatients.ts

import { useState, useEffect, useCallback } from "react";
import { Patient } from "../models/types";
import { PatientService } from "../services/PatientService";

/**
 * Hook to fetch all patients.
 * Returns { data, loading, error }.
 */
export function usePatients() {
  const [data, setData] = useState<Patient[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const service = new PatientService();
      const patients = await service.listPatients();
      setData(patients);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return { data, loading, error, refetch: fetchPatients };
}
