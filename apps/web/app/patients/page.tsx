"use client";
import React from "react";
import PatientHeader from "../../lib/patient/components/PatientHeader";
import PatientStatistics from "../../lib/patient/components/PatientStatistics";
import PatientTable from "../../lib/patient/components/PatientTable";
import LoadingSkeleton from "../../lib/patient/components/LoadingSkeleton";
import ErrorState from "../../lib/patient/components/ErrorState";
import { usePatientStats } from "../../lib/patient/hooks/usePatientStats";

export default function PatientDashboardPage() {
  const { stats, loading, error } = usePatientStats();

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="p-4">
      <PatientHeader />
      <PatientStatistics stats={stats} />
      {/* Dashboard may show summary, not full table */}
      <PatientTable patients={[]} pageSize={5} />
    </div>
  );
}
