// lib/patient/components/PatientHeader.tsx

"use client";

import React from "react";

export default function PatientHeader() {
  return (
    <header className="flex items-center justify-between py-4">
      <h1 className="text-2xl font-bold">Patients</h1>
      {/* Add actions like "Add Patient" button in future */}
    </header>
  );
}
