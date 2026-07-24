// apps/web/lib/imaging/hooks/useImagingServices.ts

import { useState, useEffect, useCallback } from "react";
import { ImagingService } from "../models/types";
import { ImagingCatalogService } from "../services/ImagingCatalogService";
import { useCurrentUser } from "../../../src/lib/auth/hooks";

interface UseImagingServicesFilters {
  categoryId?: string;
  modality?: string;
  search?: string;
  fastingRequired?: boolean;
  contrastRequired?: boolean;
  featuredOnly?: boolean;
  popularOnly?: boolean;
}

interface UseImagingServicesOptions {
  includeDeleted?: boolean;
}

/**
 * Hook to fetch filtered and searched imaging services.
 * Dynamically enforces patient vs admin status visibility guards.
 * Returns { data, loading, error, refetch, filters, updateFilters, clearFilters }.
 */
export function useImagingServices(
  initialFilters?: UseImagingServicesFilters,
  options?: UseImagingServicesOptions
) {
  const [data, setData] = useState<ImagingService[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<UseImagingServicesFilters | undefined>(initialFilters);
  const user = useCurrentUser();

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const service = new ImagingCatalogService();
      const isAdmin = user ? user.role !== "patient" : false;
      const services = await service.getServices(filters, {
        isAdmin,
        includeDeleted: options?.includeDeleted,
      });
      setData(services);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [filters, user, options?.includeDeleted]);

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
