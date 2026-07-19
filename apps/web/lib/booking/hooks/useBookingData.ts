// lib/booking/hooks/useBookingData.ts

"use client";

import { useEffect, useState, useCallback } from "react";
import { Appointment } from "../models/types";
import { COLLECTIONS } from "../models/constants";
import { getFirestore, collection, getDocs } from "firebase/firestore";

/**
 * Minimal hook that mimics the Dashboard hook pattern.
 * Returns an array of appointments (bookings) for the current user.
 * In this foundation stage it returns an empty array and a no‑op refresh.
 */
export function useBookingData() {
  const [data, setData] = useState<Appointment[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Dummy implementation – real fetch will be added later.
      const db = getFirestore();
      const colRef = collection(db, COLLECTIONS.bookings);
      const snap = await getDocs(colRef);
      const bookings = snap.docs.map((doc) => doc.data() as Appointment);
      setData(bookings);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // In a real app we would fetch the current patient ID.
    // For now we just load all bookings.
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refresh } as const;
}
