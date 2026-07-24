// apps/web/lib/providerOfferings/hooks/useProviderOfferings.ts

/**
 * React hooks for the Provider Offering domain.
 * All hooks call the service layer; they never talk to Firestore directly.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import type { DocumentSnapshot } from "firebase/firestore";
import { ProviderOfferingService, AppRole, OfferingParentSnapshot } from "../services/ProviderOfferingService";
import type { OfferingSearchFilters } from "../repositories/ProviderOfferingRepository";
import type { ProviderOffering } from "../models/types";
import type { ProviderOfferingFormData } from "../models/form";
import { ProviderOfferingStatus } from "../models/enums";

const service = new ProviderOfferingService();

// ---------------------------------------------------------------------------
// useProviderOffering – fetch a single offering by ID
// ---------------------------------------------------------------------------

export interface UseProviderOfferingState {
  offering: ProviderOffering | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Fetch a single Provider Offering by document ID.
 * Returns null while loading or if the offering does not exist.
 */
export function useProviderOffering(id: string | null | undefined): UseProviderOfferingState {
  const [offering, setOffering] = useState<ProviderOffering | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    service
      .getOffering(id)
      .then((result) => {
        if (!cancelled) {
          setOffering(result);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id, tick]);

  return { offering, loading, error, refresh };
}

// ---------------------------------------------------------------------------
// useProviderOfferingsList – paginated list with filters
// ---------------------------------------------------------------------------

export interface UseProviderOfferingsListState {
  offerings: ProviderOffering[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

/**
 * Fetch a paginated list of Provider Offerings matching the given filters.
 * Supports cursor‑based pagination via `loadMore`.
 *
 * @param filters  - Search / filter criteria.
 * @param pageSize - Number of results per page (default 20).
 */
export function useProviderOfferingsList(
  filters: OfferingSearchFilters = {},
  pageSize = 20
): UseProviderOfferingsListState {
  const [offerings, setOfferings] = useState<ProviderOffering[]>([]);
  const [cursor, setCursor] = useState<DocumentSnapshot | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [tick, setTick] = useState(0);

  // Stable key for filters so we can detect when they change
  const filtersKey = JSON.stringify(filters);

  const fetchPage = useCallback(
    async (pageCursor?: DocumentSnapshot, append = false) => {
      setLoading(true);
      setError(null);
      try {
        const result = await service.listOfferings(
          JSON.parse(filtersKey) as OfferingSearchFilters,
          pageSize,
          pageCursor
        );
        setOfferings((prev) => (append ? [...prev, ...result.offerings] : result.offerings));
        setCursor(result.nextCursor);
        setHasMore(!!result.nextCursor);
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filtersKey, pageSize, tick]
  );

  // Reset and re‑fetch when filters change or when refresh() is called
  useEffect(() => {
    setOfferings([]);
    setCursor(undefined);
    setHasMore(false);
    fetchPage(undefined, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey, tick]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore && cursor) {
      fetchPage(cursor, true);
    }
  }, [loading, hasMore, cursor, fetchPage]);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  return { offerings, loading, error, hasMore, loadMore, refresh };
}

// ---------------------------------------------------------------------------
// useProviderOfferingMutations – create / update / status / delete actions
// ---------------------------------------------------------------------------

export interface MutationState {
  loading: boolean;
  error: string | null;
}

export interface UseProviderOfferingMutationsReturn {
  createOffering: (
    providerLocationId: string,
    diagnosticServiceId: string,
    formData: ProviderOfferingFormData,
    parentSnapshot: OfferingParentSnapshot,
    userId: string
  ) => Promise<ProviderOffering | null>;
  updateOffering: (
    id: string,
    formData: Partial<ProviderOfferingFormData>,
    parentSnapshot: OfferingParentSnapshot,
    userId: string
  ) => Promise<boolean>;
  transitionStatus: (
    id: string,
    newStatus: ProviderOfferingStatus,
    userId: string,
    userRole: AppRole
  ) => Promise<boolean>;
  archiveOffering: (id: string, userId: string, userRole: AppRole) => Promise<boolean>;
  restoreOffering: (id: string, userId: string, userRole: AppRole) => Promise<boolean>;
  deleteOffering: (id: string, userId: string, userRole: AppRole) => Promise<boolean>;
  state: MutationState;
}

/**
 * Returns mutation helpers (create, update, status transitions, delete) for
 * Provider Offerings, each with shared loading / error state.
 */
export function useProviderOfferingMutations(): UseProviderOfferingMutationsReturn {
  const [state, setState] = useState<MutationState>({ loading: false, error: null });

  const run = async <T>(fn: () => Promise<T>): Promise<T | null> => {
    setState({ loading: true, error: null });
    try {
      const result = await fn();
      setState({ loading: false, error: null });
      return result;
    } catch (err: unknown) {
      setState({ loading: false, error: (err as Error).message });
      return null;
    }
  };

  const createOffering = useCallback(
    (
      providerLocationId: string,
      diagnosticServiceId: string,
      formData: ProviderOfferingFormData,
      parentSnapshot: OfferingParentSnapshot,
      userId: string
    ) =>
      run(() =>
        service.createOffering(
          providerLocationId,
          diagnosticServiceId,
          formData,
          parentSnapshot,
          userId
        )
      ) as Promise<ProviderOffering | null>,
    []
  );

  const updateOffering = useCallback(
    async (
      id: string,
      formData: Partial<ProviderOfferingFormData>,
      parentSnapshot: OfferingParentSnapshot,
      userId: string
    ): Promise<boolean> => {
      const result = await run(() =>
        service.updateOffering(id, formData, parentSnapshot, userId)
      );
      return result !== null;
    },
    []
  );

  const transitionStatus = useCallback(
    async (
      id: string,
      newStatus: ProviderOfferingStatus,
      userId: string,
      userRole: AppRole
    ): Promise<boolean> => {
      const result = await run(() =>
        service.transitionStatus(id, newStatus, userId, userRole)
      );
      return result !== null;
    },
    []
  );

  const archiveOffering = useCallback(
    async (id: string, userId: string, userRole: AppRole): Promise<boolean> => {
      const result = await run(() => service.archiveOffering(id, userId, userRole));
      return result !== null;
    },
    []
  );

  const restoreOffering = useCallback(
    async (id: string, userId: string, userRole: AppRole): Promise<boolean> => {
      const result = await run(() => service.restoreOffering(id, userId, userRole));
      return result !== null;
    },
    []
  );

  const deleteOffering = useCallback(
    async (id: string, userId: string, userRole: AppRole): Promise<boolean> => {
      const result = await run(() => service.deleteOffering(id, userId, userRole));
      return result !== null;
    },
    []
  );

  return {
    createOffering,
    updateOffering,
    transitionStatus,
    archiveOffering,
    restoreOffering,
    deleteOffering,
    state,
  };
}
