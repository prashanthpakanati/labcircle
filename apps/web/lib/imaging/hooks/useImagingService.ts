// apps/web/lib/imaging/hooks/useImagingService.ts

import { useState, useEffect, useCallback } from "react";
import { ImagingService } from "../models/types";
import { ImagingCatalogService } from "../services/ImagingCatalogService";

/**
 * Hook to fetch a single service by its ID or slug.
 * Returns { data, loading, error, refetch }.
 */
export function useImagingService(idOrSlug: string) {
  const [data, setData] = useState<ImagingService | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchService = useCallback(async () => {
    if (!idOrSlug) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const service = new ImagingCatalogService();
      // Try ID first, then fallback to slug
      let res = await service.getService(idOrSlug);
      if (!res) {
        res = await service.getServiceBySlug(idOrSlug);
      }
      setData(res);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [idOrSlug]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  return { data, loading, error, refetch: fetchService };
}
