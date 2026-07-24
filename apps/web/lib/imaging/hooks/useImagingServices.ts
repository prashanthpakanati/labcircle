// apps/web/lib/imaging/hooks/useImagingServices.ts

import { useState, useEffect, useCallback } from "react";
import { ImagingService } from "../models/types";
import { ImagingCatalogService } from "../services/ImagingCatalogService";

interface UseImagingServicesFilters {
  categoryId?: string;
  modality?: string;
  search?: string;
  activeOnly?: boolean;
  featuredOnly?: boolean;
  popularOnly?: boolean;
  fastingRequired?: boolean;
  contrastRequired?: boolean;
}

/**
 * Hook to fetch filtered and searched imaging services.
 * Returns { data, loading, error, refetch }.
 */
export function useImagingServices(initialFilters?: UseImagingServicesFilters) {
  const [data, setData] = useState<ImagingService[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<UseImagingServicesFilters | undefined>(initialFilters);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const service = new ImagingCatalogService();
      const services = await service.getServices(filters);
      setData(services);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const updateFilters = (newFilters: Partial<UseImagingServicesFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters(undefined);
  };

  return {
    data,
    loading,
    error,
    refetch: fetchServices,
    filters,
    updateFilters,
    clearFilters,
  };
}
