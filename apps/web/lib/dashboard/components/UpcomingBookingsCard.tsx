// UpcomingBookingsCard.tsx
// Stateless presentation component for upcoming bookings.

import React from "react";
import DashboardCard from "./DashboardCard";
import EmptyState from "./EmptyState";
import { Booking } from "../dashboardService";

export interface UpcomingBookingsCardProps {
  bookings: Booking[];
  isLoading?: boolean;
}

export default function UpcomingBookingsCard({ bookings, isLoading = false }: UpcomingBookingsCardProps) {
  const isEmpty = !isLoading && bookings.length === 0;

  return (
    <DashboardCard title="Upcoming Bookings">
      {isLoading ? (
        <div className="space-y-2 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-3/4" />
          ))}
        </div>
      ) : isEmpty ? (
        <EmptyState title="No upcoming bookings" subtitle="You have no scheduled appointments." />
      ) : (
        <ul className="space-y-2">
          {bookings.map((b) => (
            <li key={b.id} className="flex justify-between items-center">
              <span className="font-medium">{b.status ?? "Appointment"}</span>
              <span className="text-sm text-gray-500">
                {b.scheduledAt.toLocaleDateString()} {b.scheduledAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
