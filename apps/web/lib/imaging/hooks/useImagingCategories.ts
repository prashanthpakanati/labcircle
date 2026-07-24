// apps/web/lib/imaging/hooks/useImagingCategories.ts

import { useState, useEffect, useCallback } from "react";
import { ImagingCategory } from "../models/types";
import { ImagingCatalogService } from "../services/ImagingCatalogService";
import { useCurrentUser } from "../../../src/lib/auth/hooks";

/**
 * Hook to fetch all imaging categories.
 * Restricts draft categories visibility to administrators.
 * Returns { data, loading, error, refetch }.
 */
export function useImagingCategories(options?: { includeDeleted?: boolean }) {
  const [data, setData] = useState<ImagingCategory[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const user = useCurrentUser();

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const service = new ImagingCatalogService();
      const isAdmin = user ? user.role !== "patient" : false;
      const categories = await service.getCategories({
        isAdmin,
        includeDeleted: options?.includeDeleted,
      });
      setData(categories);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [user, options?.includeDeleted]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { data, loading, error, refetch: fetchCategories };
}
