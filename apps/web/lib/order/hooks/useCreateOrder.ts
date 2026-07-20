// apps/web/lib/order/hooks/useCreateOrder.ts

"use client";

import { useState, useCallback } from "react";
import { OrderService } from "../services/OrderService";
import { OrderFormData } from "../models/form";
import { validateOrder } from "../validation/validateOrder";
import { Order } from "../models/types";

export function useCreateOrder() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const createOrder = useCallback(async (form: OrderFormData): Promise<Order | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const validation = validateOrder(form);
      if (!validation.isValid) {
        throw new Error("Validation failed");
      }
      const service = new OrderService();
      const created = await service.createOrder(form);
      setSuccess(true);
      return created;
    } catch (e) {
      setError(e as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createOrder, loading, error, success } as const;
}
