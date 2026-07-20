// apps/web/lib/order/hooks/useOrder.ts

import { useState, useEffect, useCallback } from "react";
import { Order } from "../models/types";
import { OrderService } from "../services/OrderService";

/** Hook to fetch a single order by Firestore document ID. */
export function useOrder(id: string) {
  const [data, setData] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const service = new OrderService();
      const order = await service.getOrder(id);
      setData(order);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return { data, loading, error, refetch: fetchOrder };
}
