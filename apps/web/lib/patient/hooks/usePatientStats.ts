// lib/patient/hooks/usePatientStats.ts

"use client";

import { useMemo } from "react";
import { usePatients } from "./usePatients";
import { PatientStatus } from "../models/enums";
import { CollectionType } from "../enums/CollectionType";

export interface PatientStats {
  total: number;
  active: number;
  inactive: number;
  todaysRegistrations: number;
  homeCollection: number;
}

export function usePatientStats() {
  const { data: patients, loading, error } = usePatients();

  const stats = useMemo<PatientStats>(() => {
    if (!patients) {
      return { total: 0, active: 0, inactive: 0, todaysRegistrations: 0, homeCollection: 0 };
    }
    const today = new Date();
    const isToday = (dateStr: string) => {
      const d = new Date(dateStr);
      return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
    };
    const total = patients.length;
    const active = patients.filter((p) => p.status === PatientStatus.Active).length;
    const inactive = patients.filter((p) => p.status === PatientStatus.Inactive).length;
    const todaysRegistrations = patients.filter((p) => isToday(p.createdAt)).length;
    const homeCollection = patients.filter((p) => p.preferredCollectionType === CollectionType.HOME).length;
    return { total, active, inactive, todaysRegistrations, homeCollection };
  }, [patients]);

  return { stats, loading, error } as const;
}
