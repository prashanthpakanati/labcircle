// apps/web/lib/providerAvailability/hooks/useAvailability.ts

"use client";

import { useState, useEffect, useCallback } from "react";
import { ImagingCenterAvailabilityService } from "../services/ImagingCenterAvailabilityService";
import { ImagingCenterAvailability, BookingIntent } from "../models/types";
import { ServiceCategory } from "../models/enums";

const service = new ImagingCenterAvailabilityService();

export function useImagingCenterAvailability(providerLocationId: string | null | undefined) {
  const [data, setData] = useState<ImagingCenterAvailability | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!providerLocationId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    service
      .getImagingCenterAvailabilityByLocation(providerLocationId)
      .then((res) => {
        if (!cancelled) {
          setData(res);
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
  }, [providerLocationId, tick]);

  return { data, loading, error, refetch };
}

export function useAvailabilityMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBookingIntent = useCallback(
    async (
      category: ServiceCategory,
      dateStr: string,
      options: {
        providerLocationId?: string;
        timeSlotId?: string;
        pincode?: string;
        isExpress?: boolean;
        currentDailyBookingsCount?: number;
      },
      userId: string
    ): Promise<BookingIntent | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await service.createBookingIntent(category, dateStr, options, userId);
        setLoading(false);
        return result;
      } catch (err: unknown) {
        setError((err as Error).message);
        setLoading(false);
        return null;
      }
    },
    []
  );

  return { createBookingIntent, loading, error };
}
