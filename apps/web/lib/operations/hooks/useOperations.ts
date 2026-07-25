// apps/web/lib/operations/hooks/useOperations.ts

"use client";

import { useState, useEffect, useCallback } from "react";
import { OperationsCommandCenterService, ConsoleRole } from "../services/OperationsCommandCenterService";
import { OperationsCommandCenterState, OperationsConfig } from "../models/types";
import { RegionZone, ExceptionSeverity, ExceptionType } from "../models/enums";

const service = new OperationsCommandCenterService();

export function useOperationsCommandCenter(region: RegionZone = RegionZone.HYDERABAD_CENTRAL) {
  const [data, setData] = useState<OperationsCommandCenterState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    service
      .getCommandCenterState(region)
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
  }, [region, tick]);

  return { data, loading, error, refetch };
}

export function useOperationsConfig(region: RegionZone = RegionZone.HYDERABAD_CENTRAL) {
  const [config, setConfig] = useState<OperationsConfig | null>(null);

  useEffect(() => {
    service.getConfig(region).then(setConfig);
  }, [region]);

  return { config };
}

export function useOperationsMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createException = useCallback(
    async (
      fulfillmentId: string,
      region: RegionZone,
      type: ExceptionType,
      severity: ExceptionSeverity,
      title: string,
      description: string,
      actorId: string,
      role: ConsoleRole
    ) => {
      setLoading(true);
      setError(null);
      try {
        const res = await service.createExceptionCase(
          { fulfillmentId, region, type, severity, title, description },
          actorId,
          role
        );
        setLoading(false);
        return res;
      } catch (err: unknown) {
        setError((err as Error).message);
        setLoading(false);
        return null;
      }
    },
    []
  );

  const resolveException = useCallback(
    async (exceptionId: string, notes: string, actorId: string, role: ConsoleRole) => {
      setLoading(true);
      setError(null);
      try {
        await service.resolveExceptionCase(exceptionId, notes, actorId, role);
        setLoading(false);
        return true;
      } catch (err: unknown) {
        setError((err as Error).message);
        setLoading(false);
        return false;
      }
    },
    []
  );

  return { createException, resolveException, loading, error };
}
