"use client";
// app/dashboard/page.tsx
// Patient Dashboard page – orchestration layer only.

import React from "react";
import DashboardLayout from "../../lib/dashboard/components/DashboardLayout";
import DashboardHeader from "../../lib/dashboard/components/DashboardHeader";
import DashboardSection from "../../lib/dashboard/components/DashboardSection";
import WelcomeCard from "../../lib/dashboard/components/WelcomeCard";
import QuickActionsCard from "../../lib/dashboard/components/QuickActionsCard";
import UpcomingBookingsCard from "../../lib/dashboard/components/UpcomingBookingsCard";
import RecentReportsCard from "../../lib/dashboard/components/RecentReportsCard";
import HealthSnapshotCard, { HealthSnapshot } from "../../lib/dashboard/components/HealthSnapshotCard";


import NotificationsCard from "../../lib/dashboard/components/NotificationsCard";
import type { PromotionalBannerProps } from "../../lib/dashboard/components/PromotionalBannerCard";
import PromotionalBannerCard from "../../lib/dashboard/components/PromotionalBannerCard";


import { useDashboardData } from "../../lib/dashboard/hooks/useDashboardData";

let promotions: PromotionalBannerProps | undefined;

// NOTE: Replace "CURRENT_USER_UID" with the actual authenticated user UID.
const CURRENT_USER_UID = "placeholder-uid";

export default function DashboardPage() {
  const { data, loading, refreshing, error, refresh, retry } = useDashboardData(CURRENT_USER_UID);

  // Page‑level error when no data is available at all.
  if (error && !data) {
    return (
      <DashboardLayout>
        <DashboardHeader />
        <section className="flex flex-col items-center justify-center py-12">
          <h2 className="text-xl font-semibold mb-4">Unable to load dashboard</h2>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <button
            onClick={retry}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Retry
          </button>
        </section>
      </DashboardLayout>
    );
  }

  // Extract data safely – widgets handle empty state themselves.
  const profileCompletion = data?.profileCompletion;
  const quickActions = data?.quickActions ?? [];
  const upcomingBookings = data?.upcomingBookings ?? [];
  const recentReports = data?.recentReports ?? [];
  const healthSnapshots: HealthSnapshot[] = [];
  const notifications = data?.notifications ?? [];
  


  return (
    <DashboardLayout>
      {/* Header – includes optional refresh button */}
      <DashboardHeader />
      <section className="flex justify-end mb-4">
        <button
          onClick={refresh}
          disabled={refreshing}
          className="px-3 py-1 text-sm text-primary-600 hover:underline"
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </section>

      {/* Welcome Card */}
      <DashboardSection title="Welcome">
        <WelcomeCard
          userName="Patient"
          profileCompletion={profileCompletion}
          isLoading={loading}
        />
      </DashboardSection>

      {/* Quick Actions */}
      <DashboardSection title="Quick Actions">
        <QuickActionsCard actions={quickActions} isLoading={loading} />
      </DashboardSection>

      {/* Upcoming Bookings */}
      <DashboardSection title="Upcoming Bookings">
        <UpcomingBookingsCard bookings={upcomingBookings} isLoading={loading} />
      </DashboardSection>

      {/* Recent Reports */}
      <DashboardSection title="Recent Reports">
        <RecentReportsCard reports={recentReports} isLoading={loading} />
      </DashboardSection>

      {/* Health Snapshot */}
      <DashboardSection title="Health Snapshot">
        <HealthSnapshotCard snapshots={healthSnapshots} isLoading={loading} />
      </DashboardSection>

      {/* Notifications */}
      <DashboardSection title="Notifications">
        <NotificationsCard notifications={notifications} isLoading={loading} />
      </DashboardSection>

      {/* Promotional Banner */}
      <DashboardSection title="Promotions">
        {promotions ? (
          <PromotionalBannerCard
            title={promotions.title}
            subtitle={promotions.subtitle}
            ctaLabel={promotions.ctaLabel}
            onCta={promotions.onCta}
            imageUrl={promotions.imageUrl}
            isLoading={loading}
          />
        ) : (
          <PromotionalBannerCard
            title=""
            isLoading={loading}
          />
        )}
      </DashboardSection>
    </DashboardLayout>
  );
}
