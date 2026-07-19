import React from 'react';

// DashboardHeader – static placeholder welcome card
// In the final version this will receive profile data via props

export default function DashboardHeader() {
  return (
    <section className="mb-8">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome, Patient!</h1>
        <p className="text-sm">Complete your profile to get the most out of LabCircle.</p>
      </div>
    </section>
  );
}
