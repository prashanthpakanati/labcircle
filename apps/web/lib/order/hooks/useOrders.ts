// apps/web/lib/order/hooks/useOrders.ts

import { useState, useEffect, useCallback } from "react";
import { Order } from "../models/types";
import { OrderService } from "../services/OrderService";

/**
 * Hook to fetch all orders.
 * Returns { data, loading, error, refetch }.
 */
export function useOrders() {
  const [data, setData] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const service = new OrderService();
      const orders = await service.listOrders();
      setData(orders);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { data, loading, error, refetch: fetchOrders };
}
