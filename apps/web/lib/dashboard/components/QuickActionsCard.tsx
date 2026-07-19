// QuickActionsCard.tsx
// Stateless presentation component for quick actions on the dashboard.

import React from "react";
import DashboardCard from "./DashboardCard";
import EmptyState from "./EmptyState";
import { QuickAction } from "../dashboardService";

export interface QuickActionsCardProps {
  actions: QuickAction[];
  isLoading?: boolean;
}

export default function QuickActionsCard({ actions, isLoading = false }: QuickActionsCardProps) {
  const isEmpty = !isLoading && actions.length === 0;

  return (
    <DashboardCard title="Quick Actions">
      {isLoading ? (
        <div className="grid grid-cols-2 gap-2 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded" />
          ))}
        </div>
      ) : isEmpty ? (
        <EmptyState title="No quick actions" subtitle="You have no actions at the moment." />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <a
              key={action.id}
              href={action.href}
              className="flex items-center justify-center p-4 bg-primary-100 text-primary-800 rounded hover:bg-primary-200"
            >
              {action.title}
            </a>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
