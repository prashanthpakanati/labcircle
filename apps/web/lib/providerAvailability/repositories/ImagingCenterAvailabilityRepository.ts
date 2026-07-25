// apps/web/lib/providerAvailability/repositories/ImagingCenterAvailabilityRepository.ts

/**
 * Repository for Imaging Center Availability Firestore operations.
 * Performs database interactions for radiology center working days, operating hours, holidays,
 * and daily booking capacity limits.
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
import { ImagingCenterAvailability } from "../models/types";

export interface ImagingCenterSearchFilters {
  providerId?: string;
  providerLocationId?: string;
  isActive?: boolean;
}

export class ImagingCenterAvailabilityRepository {
  private readonly col = collection(getFirestore(), "imaging_center_availability");

  /**
   * Persists an ImagingCenterAvailability document to Firestore.
   */
  async create(availability: ImagingCenterAvailability): Promise<void> {
    const ref = doc(this.col, availability.id);
    await setDoc(ref, {
      ...availability,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * Fetches a single ImagingCenterAvailability document by ID.
   * Returns null if document doesn't exist or is soft-deleted.
   */
  async getById(id: string): Promise<ImagingCenterAvailability | null> {
    const snap = await getDoc(doc(this.col, id));
    if (!snap.exists()) return null;
    const data = snap.data() as ImagingCenterAvailability;
    if (data.deletedAt) return null;
    return data;
  }

  /**
   * Fetches availability configuration for a specific provider location ID.
   */
  async getByProviderLocationId(
    providerLocationId: string
  ): Promise<ImagingCenterAvailability | null> {
    const q = query(
      this.col,
      where("providerLocationId", "==", providerLocationId),
      where("deletedAt", "==", null),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data() as ImagingCenterAvailability;
  }

  /**
   * Updates an existing ImagingCenterAvailability document in Firestore.
   */
  async update(availability: ImagingCenterAvailability): Promise<void> {
    const ref = doc(this.col, availability.id);
    await updateDoc(ref, { ...availability, updatedAt: serverTimestamp() });
  }

  /**
   * Soft-deletes an ImagingCenterAvailability record.
   */
  async softDelete(id: string, deletedBy: string): Promise<void> {
    const ref = doc(this.col, id);
    await updateDoc(ref, {
      deletedAt: serverTimestamp(),
      deletedBy,
    });
  }

  /**
   * Restores a soft-deleted ImagingCenterAvailability record.
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
   * Searches ImagingCenterAvailability records with cursor-based pagination.
   */
  async search(
    filters: ImagingCenterSearchFilters,
    pageSize: number,
    cursor?: DocumentSnapshot
  ): Promise<{ availabilities: ImagingCenterAvailability[]; nextCursor?: DocumentSnapshot }> {
    let q = query(this.col);
    if (filters.providerId) q = query(q, where("providerId", "==", filters.providerId));
    if (filters.providerLocationId)
      q = query(q, where("providerLocationId", "==", filters.providerLocationId));
    if (filters.isActive !== undefined) q = query(q, where("isActive", "==", filters.isActive));

    q = query(q, orderBy("createdAt", "desc"), orderBy("__name__"));
    q = query(q, limit(pageSize));
    if (cursor) q = query(q, startAfter(cursor));

    const snap = await getDocs(q);
    const availabilities: ImagingCenterAvailability[] = [];
    snap.forEach((d) => {
      const data = d.data() as ImagingCenterAvailability;
      if (!data.deletedAt) availabilities.push(data);
    });

    const nextCursor =
      availabilities.length === pageSize ? snap.docs[snap.docs.length - 1] : undefined;
    return { availabilities, nextCursor };
  }
}
