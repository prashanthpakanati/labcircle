// apps/web/lib/fulfillment/hooks/useFulfillment.ts

"use client";

import { useState, useEffect, useCallback } from "react";
import { FulfillmentService, AppRole } from "../services/FulfillmentService";
import { Fulfillment, FulfillmentTimelineEvent } from "../models/types";
import { FulfillmentStatus, FulfillmentPriority, AllocationStrategyType, AssignmentStrategyType, SpecimenType, ContainerType } from "../models/enums";
import { TechnicianCandidate } from "../utils/TechnicianAssignmentEngine";
import { ProcessingPartner } from "../models/types";

const service = new FulfillmentService();

export function useFulfillment(id: string | null | undefined) {
  const [data, setData] = useState<Fulfillment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    service
      .getFulfillment(id)
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
  }, [id, tick]);

  return { data, loading, error, refetch };
}

export function useFulfillmentTimeline(fulfillmentId: string | null | undefined) {
  const [events, setEvents] = useState<FulfillmentTimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!fulfillmentId) return;
    let cancelled = false;
    setLoading(true);

    service
      .getTimeline(fulfillmentId)
      .then((res) => {
        if (!cancelled) {
          setEvents(res);
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
  }, [fulfillmentId, tick]);

  return { events, loading, error, refetch };
}

export function useFulfillmentMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createFulfillment = useCallback(
    async (bookingId: string, serviceCategory: string, priority: FulfillmentPriority, pincode: string, userId: string, role: AppRole) => {
      setLoading(true);
      setError(null);
      try {
        const res = await service.createFulfillment({ bookingId, serviceCategory, priority, pincode }, userId, role);
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

  const assignTechnician = useCallback(
    async (fulfillmentId: string, candidates: TechnicianCandidate[], strategyType: AssignmentStrategyType, userId: string, role: AppRole) => {
      setLoading(true);
      setError(null);
      try {
        await service.assignTechnician(fulfillmentId, candidates, strategyType, userId, role);
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

  const verifyOtp = useCallback(
    async (fulfillmentId: string, otp: string, userId: string, role: AppRole) => {
      setLoading(true);
      setError(null);
      try {
        const ok = await service.verifyOtp(fulfillmentId, otp, userId, role);
        setLoading(false);
        return ok;
      } catch (err: unknown) {
        setError((err as Error).message);
        setLoading(false);
        return false;
      }
    },
    []
  );

  const addSample = useCallback(
    async (fulfillmentId: string, barcode: string, specimenType: SpecimenType, containerType: ContainerType, userId: string, role: AppRole) => {
      setLoading(true);
      setError(null);
      try {
        const sample = await service.addSample({ fulfillmentId, barcode, specimenType, containerType }, userId, role);
        setLoading(false);
        return sample;
      } catch (err: unknown) {
        setError((err as Error).message);
        setLoading(false);
        return null;
      }
    },
    []
  );

  const transitionStatus = useCallback(
    async (fulfillmentId: string, targetStatus: FulfillmentStatus, userId: string, role: AppRole, notes?: string) => {
      setLoading(true);
      setError(null);
      try {
        await service.transitionStatus(fulfillmentId, targetStatus, userId, role, notes);
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

  const allocatePartner = useCallback(
    async (fulfillmentId: string, partners: ProcessingPartner[], strategyType: AllocationStrategyType, userId: string, role: AppRole) => {
      setLoading(true);
      setError(null);
      try {
        const partner = await service.allocateProcessingPartner(fulfillmentId, partners, strategyType, userId, role);
        setLoading(false);
        return partner;
      } catch (err: unknown) {
        setError((err as Error).message);
        setLoading(false);
        return null;
      }
    },
    []
  );

  return {
    createFulfillment,
    assignTechnician,
    verifyOtp,
    addSample,
    transitionStatus,
    allocatePartner,
    loading,
    error,
  };
}
