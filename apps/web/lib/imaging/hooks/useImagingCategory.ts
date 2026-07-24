// apps/web/lib/imaging/hooks/useImagingCategory.ts

import { useState, useEffect, useCallback } from "react";
import { ImagingCategory } from "../models/types";
import { ImagingCatalogService } from "../services/ImagingCatalogService";

/**
 * Hook to fetch a single category by ID.
 * Returns { data, loading, error, refetch }.
 */
export function useImagingCategory(id: string) {
  const [data, setData] = useState<ImagingCategory | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategory = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const service = new ImagingCatalogService();
      const category = await service.getCategory(id);
      setData(category);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  return { data, loading, error, refetch: fetchCategory };
}
