// lib/patient/components/PatientStatistics.tsx

"use client";

import React from "react";
import { PatientStats } from "../hooks/usePatientStats";

interface PatientStatisticsProps {
  stats: PatientStats;
}

export default function PatientStatistics({ stats }: PatientStatisticsProps) {
  const { total, active, inactive, todaysRegistrations, homeCollection } = stats;
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="p-4 bg-gray-800 rounded shadow">
        <h3 className="text-lg font-medium">Total Patients</h3>
        <p className="text-2xl font-bold">{total}</p>
      </div>
      <div className="p-4 bg-gray-800 rounded shadow">
        <h3 className="text-lg font-medium">Active</h3>
        <p className="text-2xl font-bold">{active}</p>
      </div>
      <div className="p-4 bg-gray-800 rounded shadow">
        <h3 className="text-lg font-medium">Inactive</h3>
        <p className="text-2xl font-bold">{inactive}</p>
      </div>
      <div className="p-4 bg-gray-800 rounded shadow">
        <h3 className="text-lg font-medium">Today’s Registrations</h3>
        <p className="text-2xl font-bold">{todaysRegistrations}</p>
      </div>
      <div className="p-4 bg-gray-800 rounded shadow">
        <h3 className="text-lg font-medium">Home Collections</h3>
        <p className="text-2xl font-bold">{homeCollection}</p>
      </div>
    </section>
  );
}
