// NotificationsCard.tsx
// Stateless presentation component for recent notifications.

import React from "react";
import DashboardCard from "./DashboardCard";
import EmptyState from "./EmptyState";
import { Notification } from "../dashboardService";

export interface NotificationsCardProps {
  notifications: Notification[];
  isLoading?: boolean;
}

export default function NotificationsCard({ notifications, isLoading = false }: NotificationsCardProps) {
  const isEmpty = !isLoading && notifications.length === 0;

  return (
    <DashboardCard title="Notifications">
      {isLoading ? (
        <div className="space-y-2 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full" />
          ))}
        </div>
      ) : isEmpty ? (
        <EmptyState title="No notifications" subtitle="All caught up!" />
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li key={n.id} className="flex items-start space-x-2">
              <span className={`h-2 w-2 rounded-full ${n.read ? 'bg-gray-300' : 'bg-primary-600'}`} aria-hidden="true" />
              <p className="text-sm text-gray-800" title={n.message}>{n.message}</p>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
