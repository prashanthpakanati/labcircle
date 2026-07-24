// apps/web/lib/imaging/hooks/useImagingCategories.ts

import { useState, useEffect, useCallback } from "react";
import { ImagingCategory } from "../models/types";
import { ImagingCatalogService } from "../services/ImagingCatalogService";

/**
 * Hook to fetch all imaging categories.
 * Returns { data, loading, error, refetch }.
 */
export function useImagingCategories() {
  const [data, setData] = useState<ImagingCategory[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const service = new ImagingCatalogService();
      const categories = await service.getCategories();
      setData(categories);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { data, loading, error, refetch: fetchCategories };
}
