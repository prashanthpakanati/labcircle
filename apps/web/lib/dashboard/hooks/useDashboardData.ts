// Hook: useDashboardData
"use client";
// lib/dashboard/hooks/useDashboardData.ts
// Ensures no state updates after component unmount and prevents duplicate concurrent requests.

import { useState, useEffect, useRef, useCallback } from "react";
import { getDashboardData, DashboardData } from "../dashboardService";

export interface UseDashboardDataResult {
  data?: DashboardData;
  loading: boolean; // initial load
  refreshing: boolean; // manual refresh in progress
  error?: Error;
  refresh: () => void;
  retry: () => void;
}

/**
 * Hook to fetch dashboard data for a given user UID.
 * - Performs the initial load on mount.
 * - Exposes loading, refreshing, error, and data states.
 * - Provides refresh() and retry() functions.
 * - Prevents state updates after unmount and avoids duplicate concurrent requests.
 */
export function useDashboardData(uid: string): UseDashboardDataResult {
  const [data, setData] = useState<DashboardData | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  // Track component mount status to avoid state updates after unmount.
  const isMounted = useRef<boolean>(true);
  // Track whether a request is currently in flight.
  const requestInProgress = useRef<boolean>(false);

  const load = useCallback(async () => {
    if (requestInProgress.current) return; // avoid duplicate requests
    requestInProgress.current = true;

    if (data) {
      // Data already present – this is a refresh.
      setRefreshing(true);
    } else {
      // First load.
      setLoading(true);
    }
    setError(undefined);

    try {
      const result = await getDashboardData(uid);
      if (isMounted.current) {
        setData(result);
      }
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      console.error("Dashboard data fetch error:", err);
      if (isMounted.current) {
        setError(err);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setRefreshing(false);
      }
      requestInProgress.current = false;
    }
  }, [uid, data]);

  useEffect(() => {
    isMounted.current = true;
    load();
    return () => {
      isMounted.current = false;
    };
  }, [uid, load]);

  const refresh = useCallback(() => {
    load();
  }, [load]);

  const retry = useCallback(() => {
    if (!error) return; // No error to retry.
    load();
  }, [load, error]);

  return { data, loading, refreshing, error, refresh, retry };
}
