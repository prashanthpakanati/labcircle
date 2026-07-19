import React from 'react';

// Patient Dashboard page – foundation with static placeholders
// This page composes the dashboard layout and static placeholder widgets.

import DashboardLayout from "../../lib/dashboard/components/DashboardLayout";
import DashboardHeader from "../../lib/dashboard/components/DashboardHeader";
import DashboardSection from "../../lib/dashboard/components/DashboardSection";
import DashboardCard from "../../lib/dashboard/components/DashboardCard";
import SkeletonLoader from "../../lib/dashboard/components/SkeletonLoader";
import EmptyState from "../../lib/dashboard/components/EmptyState";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* Welcome Card */}
      <DashboardHeader />

      {/* Quick Actions Section – static placeholder */}
      <DashboardSection title="Quick Actions">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <DashboardCard title="Book Test" />
          <DashboardCard title="View Packages" />
          <DashboardCard title="My Reports" />
          <DashboardCard title="My Orders" />
          <DashboardCard title="Family Members" />
        </div>
      </DashboardSection>

      {/* Upcoming Bookings */}
      <DashboardSection title="Upcoming Bookings" isLoading>
        <SkeletonLoader rows={3} />
      </DashboardSection>

      {/* Recent Reports */}
      <DashboardSection title="Recent Reports" isLoading>
        <SkeletonLoader rows={3} />
      </DashboardSection>

      {/* Health Snapshot placeholder */}
      <DashboardSection title="Health Snapshot">
        <EmptyState title="Health Snapshot" subtitle="Coming soon" />
      </DashboardSection>

      {/* Notifications placeholder */}
      <DashboardSection title="Notifications" isLoading>
        <SkeletonLoader rows={2} />
      </DashboardSection>

      {/* Promotional Banner placeholder */}
      <DashboardSection title="" subtitle="">
        <DashboardCard title="Promotional Banner" />
      </DashboardSection>
    </DashboardLayout>
  );
}
