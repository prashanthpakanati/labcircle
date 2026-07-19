// WelcomeCard.tsx
// Stateless presentation component for greeting the user and showing profile completion.

import React from "react";
import DashboardCard from "./DashboardCard";


export interface WelcomeCardProps {
  userName?: string;
  profileCompletion?: number;
  isLoading?: boolean;
}

export default function WelcomeCard({ userName, profileCompletion, isLoading = false }: WelcomeCardProps) {
  const title = isLoading ? "Loading..." : `Welcome, ${userName ?? "User"}`;
  const subtitle = isLoading
    ? ""
    : profileCompletion !== undefined
    ? `Profile completion: ${profileCompletion}%`
    : undefined;

  return (
    <DashboardCard title={title}>
      {isLoading ? null : subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
    </DashboardCard>
  );
}
