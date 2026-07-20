// lib/patient/utils/formatPatientName.ts

import { Patient } from "../models/types";

/** Returns "First Last" */
export function formatPatientName(patient: Patient): string {
  return `${patient.firstName} ${patient.lastName}`.trim();
}
