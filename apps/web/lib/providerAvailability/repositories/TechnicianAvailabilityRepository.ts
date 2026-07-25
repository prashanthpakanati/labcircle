// apps/web/lib/providerAvailability/repositories/TechnicianAvailabilityRepository.ts

/**
 * Repository for Technician Availability Firestore operations.
 * Performs database interactions for phlebotomist home collection schedules, time slots,
 * and service area pincodes.
 */
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { TechnicianAvailability } from "../models/types";

export interface TechnicianSearchFilters {
  technicianId?: string;
  date?: string;
  pincode?: string;
  isActive?: boolean;
}

export class TechnicianAvailabilityRepository {
  private readonly col = collection(getFirestore(), "technician_availability");

  /**
   * Persists a TechnicianAvailability document to Firestore.
   */
  async create(availability: TechnicianAvailability): Promise<void> {
    const ref = doc(this.col, availability.id);
    await setDoc(ref, {
      ...availability,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * Fetches a single TechnicianAvailability document by ID.
   */
  async getById(id: string): Promise<TechnicianAvailability | null> {
    const snap = await getDoc(doc(this.col, id));
    if (!snap.exists()) return null;
    const data = snap.data() as TechnicianAvailability;
    if (data.deletedAt) return null;
    return data;
  }

  /**
   * Fetches technician schedule for a specific date and pincode.
   */
  async getByDateAndPincode(date: string, pincode: string): Promise<TechnicianAvailability[]> {
    const q = query(
      this.col,
      where("date", "==", date),
      where("serviceAreas", "array-contains", pincode.trim()),
      where("isActive", "==", true),
      where("deletedAt", "==", null)
    );
    const snap = await getDocs(q);
    const results: TechnicianAvailability[] = [];
    snap.forEach((d) => results.push(d.data() as TechnicianAvailability));
    return results;
  }

  /**
   * Updates an existing TechnicianAvailability record.
   */
  async update(availability: TechnicianAvailability): Promise<void> {
    const ref = doc(this.col, availability.id);
    await updateDoc(ref, { ...availability, updatedAt: serverTimestamp() });
  }

  /**
   * Soft-deletes a TechnicianAvailability record.
   */
  async softDelete(id: string, deletedBy: string): Promise<void> {
    const ref = doc(this.col, id);
    await updateDoc(ref, {
      deletedAt: serverTimestamp(),
      deletedBy,
    });
  }

  /**
   * Restores a soft-deleted TechnicianAvailability record.
   */
  async restore(id: string): Promise<void> {
    const ref = doc(this.col, id);
    await updateDoc(ref, {
      deletedAt: null,
      deletedBy: null,
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * Searches TechnicianAvailability records with cursor-based pagination.
   */
  async search(
    filters: TechnicianSearchFilters,
    pageSize: number,
    cursor?: DocumentSnapshot
  ): Promise<{ availabilities: TechnicianAvailability[]; nextCursor?: DocumentSnapshot }> {
    let q = query(this.col);
    if (filters.technicianId) q = query(q, where("technicianId", "==", filters.technicianId));
    if (filters.date) q = query(q, where("date", "==", filters.date));
    if (filters.pincode) q = query(q, where("serviceAreas", "array-contains", filters.pincode.trim()));
    if (filters.isActive !== undefined) q = query(q, where("isActive", "==", filters.isActive));

    q = query(q, orderBy("createdAt", "desc"), orderBy("__name__"));
    q = query(q, limit(pageSize));
    if (cursor) q = query(q, startAfter(cursor));

    const snap = await getDocs(q);
    const availabilities: TechnicianAvailability[] = [];
    snap.forEach((d) => {
      const data = d.data() as TechnicianAvailability;
      if (!data.deletedAt) availabilities.push(data);
    });

    const nextCursor =
      availabilities.length === pageSize ? snap.docs[snap.docs.length - 1] : undefined;
    return { availabilities, nextCursor };
  }
}
