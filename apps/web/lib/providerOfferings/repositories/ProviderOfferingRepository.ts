// apps/web/lib/providerOfferings/repositories/ProviderOfferingRepository.ts

/**
 * Repository for Provider Offering Firestore operations.
 * All methods perform only data access; business rules belong to the service layer.
 */
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, query, where, orderBy, limit, startAfter, DocumentSnapshot, getDocs, serverTimestamp } from "firebase/firestore";
import { ProviderOffering } from "../models/types";

/**
 * Search filter interface used by the repository.
 */
export interface OfferingSearchFilters {
  providerLocationId?: string;
  diagnosticServiceId?: string;
  providerName?: string; // denormalized snapshot field
  providerBrandName?: string; // denormalized snapshot field
  serviceName?: string; // denormalized snapshot field
  serviceCode?: string; // denormalized snapshot field
  categoryId?: string; // denormalized snapshot field
  status?: string; // ProviderOfferingStatus string
  availabilityEnabled?: boolean;
  availabilityOnlineBookable?: boolean;
  minPrice?: number; // sellingPrice range
  maxPrice?: number;
  searchKeywords?: string[]; // array-contains-any filter
}

export class ProviderOfferingRepository {
  private readonly col = collection(getFirestore(), "provider_offerings");

  /** Create a new offering document (assumes caller performed validation). */
  async create(offering: ProviderOffering): Promise<void> {
    const ref = doc(this.col, offering.id);
    await setDoc(ref, { ...offering, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }

  /** Fetch offering by ID, excluding soft‑deleted records. */
  async getById(id: string): Promise<ProviderOffering | null> {
    const snap = await getDoc(doc(this.col, id));
    if (!snap.exists()) return null;
    const data = snap.data() as ProviderOffering;
    if (data.deletedAt) return null; // soft‑deleted
    return data;
  }

  /** Update an existing offering (full document replace). */
  async update(offering: ProviderOffering): Promise<void> {
    const ref = doc(this.col, offering.id);
    await updateDoc(ref, { ...offering, updatedAt: serverTimestamp() });
  }

  /** Soft‑delete an offering. */
  async softDelete(id: string, deletedBy: string): Promise<void> {
    const ref = doc(this.col, id);
    await updateDoc(ref, {
      deletedAt: serverTimestamp(),
      deletedBy,
    });
  }

  /**
   * Check for an existing active (non‑deleted, non‑Archived) offering for the
   * same providerLocationId + diagnosticServiceId pair.
   * Uses getDocs rather than a transaction because Firestore transactions
   * only accept DocumentReferences, not Queries.
   */
  async existsDuplicate(providerLocationId: string, diagnosticServiceId: string): Promise<boolean> {
    const dupQuery = query(
      this.col,
      where("providerLocationId", "==", providerLocationId),
      where("diagnosticServiceId", "==", diagnosticServiceId),
      where("status", "!=", "Archived"),
      where("deletedAt", "==", null),
      limit(1)
    );
    const snap = await getDocs(dupQuery);
    return !snap.empty;
  }

  /** Search offerings with cursor‑based pagination.
   * Returns the matching documents and a cursor for the next page (if any).
   */
  async search(
    filters: OfferingSearchFilters,
    pageSize: number,
    cursor?: DocumentSnapshot
  ): Promise<{ offerings: ProviderOffering[]; nextCursor?: DocumentSnapshot }> {
    let q = query(this.col);
    if (filters.providerLocationId) q = query(q, where("providerLocationId", "==", filters.providerLocationId));
    if (filters.diagnosticServiceId) q = query(q, where("diagnosticServiceId", "==", filters.diagnosticServiceId));
    if (filters.status) q = query(q, where("status", "==", filters.status));
    if (filters.availabilityEnabled !== undefined) q = query(q, where("availability.enabled", "==", filters.availabilityEnabled));
    if (filters.availabilityOnlineBookable !== undefined) q = query(q, where("availability.onlineBookable", "==", filters.availabilityOnlineBookable));
    if (filters.minPrice !== undefined) q = query(q, where("priceConfiguration.sellingPrice", ">=", filters.minPrice));
    if (filters.maxPrice !== undefined) q = query(q, where("priceConfiguration.sellingPrice", "<=", filters.maxPrice));
    if (filters.searchKeywords && filters.searchKeywords.length) {
      q = query(q, where("searchKeywords", "array-contains-any", filters.searchKeywords));
    }
    // Stable ordering for cursor pagination – use Firestore document name as tie‑breaker
    q = query(q, orderBy("createdAt", "desc"), orderBy("__name__"));
    q = query(q, limit(pageSize));
    if (cursor) q = query(q, startAfter(cursor));
    const snap = await getDocs(q);
    const offerings: ProviderOffering[] = [];
    snap.forEach((doc) => {
      const data = doc.data() as ProviderOffering;
      if (!data.deletedAt) offerings.push(data);
    });
    const nextCursor = offerings.length === pageSize ? snap.docs[snap.docs.length - 1] : undefined;
    return { offerings, nextCursor };
  }
}
