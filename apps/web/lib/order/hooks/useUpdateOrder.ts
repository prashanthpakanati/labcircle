// apps/web/lib/order/hooks/useUpdateOrder.ts

"use client";

import { useState, useCallback } from "react";
import { OrderService } from "../services/OrderService";
import { OrderFormData } from "../models/form";
import { OrderStatus, PaymentStatus } from "../models/enums";

export function useUpdateOrder() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const updateOrder = useCallback(
    async (
      id: string,
      updates: Partial<OrderFormData> & { status?: OrderStatus; paymentStatus?: PaymentStatus }
    ): Promise<void> => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const service = new OrderService();
        await service.updateOrder(id, updates);
        setSuccess(true);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { updateOrder, loading, error, success } as const;
}
