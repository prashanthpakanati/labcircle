// lib/patient/services/PatientService.ts

import { getFirestore, collection, doc, setDoc, getDoc, getDocs, Timestamp, runTransaction } from "firebase/firestore";
import { PATIENT_COLLECTION } from "../models/constants";
import { Patient } from "../models/types";
import { PatientStatus } from "../models/enums";
import { PatientFormData } from "../models/form";

/**
 * PatientService implements CRUD operations for the Patient domain.
 * All business rules (e.g., status transitions) are handled in the service.
 * Validation is performed outside the service (in hooks). No UI logic.
 */
export class PatientService {
  private db = getFirestore();

  /** Create a new patient and generate a displayId (PAT000001). */
  async createPatient(form: PatientFormData): Promise<Patient> {
    const patientRef = doc(collection(this.db, PATIENT_COLLECTION));
    const counterRef = doc(this.db, "counters", "patients");

    // Transaction to atomically increment counter and obtain the new displayId.
    const newCount = await runTransaction(this.db, async (tx) => {
      const snap = await tx.get(counterRef);
      const current = snap.exists() ? (snap.data() as { value: number }).value : 0;
      const next = current + 1;
      tx.set(counterRef, { value: next });
      return next;
    });

    const displayId = `PAT${String(newCount).padStart(6, "0")}`;
    const now = Timestamp.now();
    const patient: Patient = {
      id: patientRef.id,
      displayId,
      firstName: form.firstName,
      lastName: form.lastName,
      gender: form.gender,
      dateOfBirth: form.dateOfBirth,
      phone: form.phone,
      email: form.email,
      address: form.address,
      city: form.city,
      state: form.state,
      pinCode: form.pinCode,
      bloodGroup: form.bloodGroup,
      emergencyContact: form.emergencyContact,
      emergencyPhone: form.emergencyPhone,
      preferredCollectionType: form.preferredCollectionType,
      status: PatientStatus.Active,
      createdAt: now.toDate().toISOString(),
      updatedAt: now.toDate().toISOString(),
    };
    await setDoc(patientRef, patient);
    return patient;
  }

  /** Retrieve a patient by Firestore document ID. */
  async getPatient(id: string): Promise<Patient> {
    const snap = await getDoc(doc(this.db, PATIENT_COLLECTION, id));
    if (!snap.exists()) throw new Error(`Patient ${id} not found`);
    return snap.data() as Patient;
  }

  /** List all patients. */
  async listPatients(): Promise<Patient[]> {
    const colRef = collection(this.db, PATIENT_COLLECTION);
    const snap = await getDocs(colRef);
    return snap.docs.map((d) => d.data() as Patient);
  }

  /** Update mutable fields of a patient. */
  async updatePatient(id: string, updates: Partial<PatientFormData> & { status?: PatientStatus }): Promise<void> {
    const patientRef = doc(this.db, PATIENT_COLLECTION, id);
    const upd = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    await setDoc(patientRef, upd, { merge: true });
  }

  /** Deactivate a patient (set status to Inactive). */
  async deactivatePatient(id: string): Promise<void> {
    await this.updatePatient(id, { status: PatientStatus.Inactive });
  }
}
