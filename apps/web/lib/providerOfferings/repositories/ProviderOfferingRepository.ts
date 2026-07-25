// apps/web/lib/providerOfferings/repositories/ProviderOfferingRepository.ts

/**
 * Repository for Provider Offering Firestore operations.
 * Performs strictly database interactions without business logic or authorization checks.
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
import { ProviderOffering } from "../models/types";

/**
 * Filter criteria for querying offerings in the repository layer.
 */
export interface OfferingSearchFilters {
  /** Filter by parent branch location ID. */
  providerLocationId?: string;
  /** Filter by catalog diagnostic service ID. */
  diagnosticServiceId?: string;
  /** Filter by provider legal name. */
  providerName?: string;
  /** Filter by provider brand name. */
  providerBrandName?: string;
  /** Filter by diagnostic service name. */
  serviceName?: string;
  /** Filter by diagnostic service code. */
  serviceCode?: string;
  /** Filter by service catalog category ID. */
  categoryId?: string;
  /** Filter by offering status (Draft, Published, Archived). */
  status?: string;
  /** Filter by general availability state. */
  availabilityEnabled?: boolean;
  /** Filter by online booking support state. */
  availabilityOnlineBookable?: boolean;
  /** Minimum selling price threshold for price range filtering. */
  minPrice?: number;
  /** Maximum selling price threshold for price range filtering. */
  maxPrice?: number;
  /** Tokenized keywords for search query filtering. */
  searchKeywords?: string[];
}

export class ProviderOfferingRepository {
  private readonly col = collection(getFirestore(), "provider_offerings");

  /**
   * Persists a new ProviderOffering document to Firestore.
   * Assumes validation and defaulting has been completed by the caller.
   *
   * @param offering - The ProviderOffering instance to create.
   */
  async create(offering: ProviderOffering): Promise<void> {
    const ref = doc(this.col, offering.id);
    await setDoc(ref, {
      ...offering,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * Fetches a single ProviderOffering document by ID.
   * Excludes documents that have been soft-deleted (deletedAt != null).
   *
   * @param id - Document ID of the target offering.
   * @returns The ProviderOffering object, or null if not found/deleted.
   */
  async getById(id: string): Promise<ProviderOffering | null> {
    const snap = await getDoc(doc(this.col, id));
    if (!snap.exists()) return null;
    const data = snap.data() as ProviderOffering;
    if (data.deletedAt) return null; // soft-deleted
    return data;
  }

  /**
   * Updates an existing ProviderOffering document in Firestore.
   * Overwrites the document fields and updates the updatedAt timestamp.
   *
   * @param offering - The ProviderOffering instance containing updated data.
   */
  async update(offering: ProviderOffering): Promise<void> {
    const ref = doc(this.col, offering.id);
    await updateDoc(ref, { ...offering, updatedAt: serverTimestamp() });
  }

  /**
   * Soft-deletes a ProviderOffering document by recording deletion metadata.
   * Does not remove the document from Firestore.
   *
   * @param id - Document ID of the offering to soft-delete.
   * @param deletedBy - User ID of the actor performing the deletion.
   */
  async softDelete(id: string, deletedBy: string): Promise<void> {
    const ref = doc(this.col, id);
    await updateDoc(ref, {
      deletedAt: serverTimestamp(),
      deletedBy,
    });
  }

  /**
   * Restores a soft-deleted ProviderOffering document by clearing deletion metadata.
   * Re-exposes the document to normal read queries.
   *
   * @param id - Document ID of the offering to restore.
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
   * Helper method to fetch all active offerings for a specific provider location.
   * Reuses search() logic internally without duplicating query logic.
   *
   * @param providerLocationId - Parent location ID.
   * @param limitSize - Maximum number of results to fetch (default: 100).
   * @returns List of active offerings for the given location.
   */
  async getByLocation(providerLocationId: string, limitSize = 100): Promise<ProviderOffering[]> {
    const result = await this.search({ providerLocationId }, limitSize);
    return result.offerings;
  }

  /**
   * Helper method to fetch all active offerings linked to a specific diagnostic service.
   * Reuses search() logic internally without duplicating query logic.
   *
   * @param diagnosticServiceId - Catalog service ID.
   * @param limitSize - Maximum number of results to fetch (default: 100).
   * @returns List of active offerings associated with the diagnostic service.
   */
  async getByDiagnosticService(
    diagnosticServiceId: string,
    limitSize = 100
  ): Promise<ProviderOffering[]> {
    const result = await this.search({ diagnosticServiceId }, limitSize);
    return result.offerings;
  }

  /**
   * Checks for an existing active (non-deleted, non-Archived) offering for a
   * given (providerLocationId + diagnosticServiceId) pair.
   *
   * ARCHITECTURAL & LIMITATION NOTES ON FIRESTORE DUPLICATE VALIDATION:
   * ------------------------------------------------------------------
   * • Firestore client SDK transactions only accept DocumentReferences (getDoc),
   *   NOT collection Queries (getDocs). Therefore, atomic query-based uniqueness checks
   *   cannot be executed inside a native Firestore client transaction.
   * • This getDocs()-based validation query is sufficient and safe for current low-concurrency
   *   administrative operations (e.g. catalog management by authorized staff).
   * • Future high-concurrency production scaling may require a deterministic uniqueness strategy,
   *   such as using a composite document ID (`${providerLocationId}_${diagnosticServiceId}`)
   *   or executing uniqueness enforcement within a Firestore Cloud Function / Backend API transaction.
   *
   * @param providerLocationId - Parent branch location ID.
   * @param diagnosticServiceId - Catalog service ID.
   * @returns True if an active duplicate offering exists, false otherwise.
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

  /**
   * Executes a paginated search query against provider_offerings.
   * Supports filtering by location, service, status, pricing, availability, and search keywords.
   * Uses stable cursor-based pagination based on createdAt and document ID (__name__).
   *
   * @param filters - Search and filter options.
   * @param pageSize - Page size limit for results.
   * @param cursor - Document snapshot cursor for loading the next page.
   * @returns Object containing matching offerings and the cursor for the next page.
   */
  async search(
    filters: OfferingSearchFilters,
    pageSize: number,
    cursor?: DocumentSnapshot
  ): Promise<{ offerings: ProviderOffering[]; nextCursor?: DocumentSnapshot }> {
    let q = query(this.col);
    if (filters.providerLocationId)
      q = query(q, where("providerLocationId", "==", filters.providerLocationId));
    if (filters.diagnosticServiceId)
      q = query(q, where("diagnosticServiceId", "==", filters.diagnosticServiceId));
    if (filters.status) q = query(q, where("status", "==", filters.status));
    if (filters.availabilityEnabled !== undefined)
      q = query(q, where("availability.enabled", "==", filters.availabilityEnabled));
    if (filters.availabilityOnlineBookable !== undefined)
      q = query(q, where("availability.onlineBookable", "==", filters.availabilityOnlineBookable));
    if (filters.minPrice !== undefined)
      q = query(q, where("priceConfiguration.sellingPrice", ">=", filters.minPrice));
    if (filters.maxPrice !== undefined)
      q = query(q, where("priceConfiguration.sellingPrice", "<=", filters.maxPrice));
    if (filters.searchKeywords && filters.searchKeywords.length) {
      q = query(q, where("searchKeywords", "array-contains-any", filters.searchKeywords));
    }
    // Stable ordering for cursor pagination – use Firestore document name as tie-breaker
    q = query(q, orderBy("createdAt", "desc"), orderBy("__name__"));
    q = query(q, limit(pageSize));
    if (cursor) q = query(q, startAfter(cursor));
    const snap = await getDocs(q);
    const offerings: ProviderOffering[] = [];
    snap.forEach((doc) => {
      const data = doc.data() as ProviderOffering;
      if (!data.deletedAt) offerings.push(data);
    });
    const nextCursor =
      offerings.length === pageSize ? snap.docs[snap.docs.length - 1] : undefined;
    return { offerings, nextCursor };
  }
}
