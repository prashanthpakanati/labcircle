// HealthSnapshotCard.tsx
// Stateless presentation component for a health snapshot summary.

import React from "react";
import DashboardCard from "./DashboardCard";
import EmptyState from "./EmptyState";

// Health snapshot data – simple key/value metric display.
export interface HealthSnapshot {
  id: string;
  label: string;
  value: string;
}

export interface HealthSnapshotCardProps {
  snapshots: HealthSnapshot[];
  isLoading?: boolean;
}

export default function HealthSnapshotCard({ snapshots, isLoading = false }: HealthSnapshotCardProps) {
  const isEmpty = !isLoading && snapshots.length === 0;

  return (
    <DashboardCard title="Health Snapshot">
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded" />
          ))}
        </div>
      ) : isEmpty ? (
        <EmptyState title="No health data" subtitle="Health metrics are unavailable." />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {snapshots.map((s) => (
            <div key={s.id} className="p-4 bg-gray-50 rounded border">
              <p className="text-sm text-gray-500" aria-label={s.label}>{s.label}</p>
              <p className="text-lg font-medium" aria-live="polite">{s.value}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
