// lib/patient/models/form.ts

import { Gender } from "./types";
import { CollectionType } from "../enums/CollectionType";
import { Patient } from "./types";
/**
 * PatientFormData is the shape used by UI forms.
 * It excludes Firestore‑only fields (id, displayId, timestamps, status).
 */
export interface PatientFormData {
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string; // ISO string
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  bloodGroup: string;
  emergencyContact: string;
  emergencyPhone: string;
  preferredCollectionType: CollectionType;
}

/**
 * Mapping utilities between Firestore Patient model and PatientFormData.
 */
export const PatientMapper = {
  /** Convert Firestore Patient to PatientFormData */
  toPatientForm(patient: Patient): PatientFormData {
    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      phone,
      email,
      address,
      city,
      state,
      pinCode,
      bloodGroup,
      emergencyContact,
      emergencyPhone,
      preferredCollectionType,
    } = patient;
    return {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      phone,
      email,
      address,
      city,
      state,
      pinCode,
      bloodGroup,
      emergencyContact,
      emergencyPhone,
      preferredCollectionType,
    };
  },

  /** Convert PatientFormData (plus optional overrides) to Firestore Patient */
  toPatient(form: PatientFormData, overrides?: Partial<Patient>): Patient {
    return {
      ...overrides,
      ...form,
    } as Patient;
  },

  /** Serialize Patient for Firestore */
  toFirestore(patient: Patient): Record<string, unknown> {
    const {
      id,
      displayId,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      phone,
      email,
      address,
      city,
      state,
      pinCode,
      bloodGroup,
      emergencyContact,
      emergencyPhone,
      preferredCollectionType,
      status,
      createdAt,
      updatedAt,
    } = patient;
    return {
      id,
      displayId,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      phone,
      email,
      address,
      city,
      state,
      pinCode,
      bloodGroup,
      emergencyContact,
      emergencyPhone,
      preferredCollectionType,
      status,
      createdAt,
      updatedAt,
    };
  },

  /** Construct Patient from Firestore data */
  fromFirestore(data: Record<string, unknown>): Patient {
    return data as unknown as Patient;
  },
};
