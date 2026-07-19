"use client";

import React from "react";
import { useBookingData } from "../../lib/booking/hooks/useBookingData";
import { Appointment } from "../../lib/booking/models/types";

export default function BookingPage() {
  const { data, isLoading, error, refresh } = useBookingData();

  if (isLoading) {
    return <div>Loading bookings…</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error loading bookings: {error.message}</p>
        <button onClick={refresh}>Retry</button>
      </div>
    );
  }

  if (data.length === 0) {
    return <div>No bookings found.</div>;
  }

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      <ul className="space-y-2">
        {data.map((booking: Appointment) => (
          <li key={booking.id} className="p-4 border rounded-lg shadow-sm">
            <p className="font-medium">Booking ID: {booking.id}</p>
            <p>Status: {booking.status}</p>
            <p>Scheduled at: {new Date(booking.scheduledAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
