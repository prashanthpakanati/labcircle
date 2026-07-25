// apps/web/lib/commerce/hooks/useCommerce.ts

"use client";

import { useState, useEffect, useCallback } from "react";
import { CommerceService, CommerceRole } from "../services/CommerceService";
import { Wallet, WalletTransaction, PricingBreakdown } from "../models/types";
import { ProcessPaymentFormData, WalletTopupFormData } from "../models/form";

const service = new CommerceService();

export function usePricing(serviceCategory: string, isHomeCollection: boolean, isExpress: boolean) {
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);

  useEffect(() => {
    const res = service.calculatePricing(serviceCategory, isHomeCollection, isExpress);
    setPricing(res);
  }, [serviceCategory, isHomeCollection, isExpress]);

  return { pricing };
}

export function useWallet(patientId: string | null | undefined) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [ledger, setLedger] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!patientId) return;
    let cancelled = false;
    setLoading(true);

    Promise.all([service.getWallet(patientId), service.getWalletLedger(patientId)]).then(([w, l]) => {
      if (!cancelled) {
        setWallet(w);
        setLedger(l);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [patientId, tick]);

  return { wallet, ledger, loading, refetch };
}

export function useCommerceMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processPayment = useCallback(async (formData: ProcessPaymentFormData, actorId: string, role: CommerceRole) => {
    setLoading(true);
    setError(null);
    try {
      const res = await service.processPayment(formData, actorId, role);
      setLoading(false);
      return res;
    } catch (err: unknown) {
      setError((err as Error).message);
      setLoading(false);
      return null;
    }
  }, []);

  const topupWallet = useCallback(async (formData: WalletTopupFormData, actorId: string, role: CommerceRole) => {
    setLoading(true);
    setError(null);
    try {
      const res = await service.topupWallet(formData, actorId, role);
      setLoading(false);
      return res;
    } catch (err: unknown) {
      setError((err as Error).message);
      setLoading(false);
      return null;
    }
  }, []);

  return { processPayment, topupWallet, loading, error };
}
