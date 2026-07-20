// apps/web/lib/patient/models/types.ts
import { PatientStatus } from "./enums";
import { CollectionType } from "../enums/CollectionType";
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string; // ISO string
  displayId: string;
  // age is derived from dateOfBirth via calculateAge; no longer persisted
  // age: number; // removed
  preferredCollectionType: CollectionType;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  bloodGroup: string;
  emergencyContact: string;
  emergencyPhone: string;
  status: PatientStatus;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export type Gender = 'Male' | 'Female' | 'Other';
