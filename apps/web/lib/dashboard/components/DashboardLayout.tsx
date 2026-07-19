import React, { ReactNode } from 'react';

// Simple layout wrapper for the dashboard page
// Uses the existing design system container classes

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className="max-w-7xl mx-auto p-4 md:p-8">
      {children}
    </main>
  );
}
