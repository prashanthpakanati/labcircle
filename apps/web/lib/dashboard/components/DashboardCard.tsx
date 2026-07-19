import React from 'react';

interface DashboardCardProps {
  title: string;
  children?: React.ReactNode;
}

// Simple reusable card component for dashboard widgets.
// Styling is intentionally minimal – actual visual design is provided by the design system CSS.
export default function DashboardCard({ title, children }: DashboardCardProps) {
  return (
    <div className="dashboard-card">
      <h3 className="dashboard-card-title">{title}</h3>
      {children && <div className="dashboard-card-content">{children}</div>}
    </div>
  );
}
