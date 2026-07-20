// apps/web/lib/test/components/TestHeader.tsx

"use client";

import React from "react";

export default function TestHeader() {
  return (
    <header className="flex items-center justify-between py-4">
      <div>
        <h1 className="text-2xl font-bold">Test Catalog</h1>
        <p className="text-sm text-muted-foreground">Manage and configure diagnostic tests, pricing, and turnaround times.</p>
      </div>
    </header>
  );
}
