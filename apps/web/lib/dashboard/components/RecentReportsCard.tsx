// RecentReportsCard.tsx
// Stateless presentation component for recent reports.

import React from "react";
import DashboardCard from "./DashboardCard";
import EmptyState from "./EmptyState";
import { Report } from "../dashboardService";

export interface RecentReportsCardProps {
  reports: Report[];
  isLoading?: boolean;
}

export default function RecentReportsCard({ reports, isLoading = false }: RecentReportsCardProps) {
  const isEmpty = !isLoading && reports.length === 0;

  return (
    <DashboardCard title="Recent Reports">
      {isLoading ? (
        <div className="space-y-2 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full" />
          ))}
        </div>
      ) : isEmpty ? (
        <EmptyState title="No reports" subtitle="You have no recent reports." />
      ) : (
        <ul className="space-y-2">
          {reports.map((r) => (
            <li key={r.id} className="flex justify-between items-center">
              <span className="font-medium" title={r.title}>{r.title ?? "Report"}</span>
              <span className="text-sm text-gray-500" title={r.createdAt.toLocaleString()}>{r.createdAt.toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
