// apps/web/app/samples/page.tsx

"use client";

import React from "react";
import Link from "next/link";

/**
 * /samples — placeholder list page.
 * Full collection management UI will be implemented in a future milestone.
 */
export default function SamplesPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-border mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Samples</h1>
          <p className="text-sm text-muted-foreground">
            Sample collection management — coming soon.
          </p>
        </div>
        <Link
          href="/samples/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
        >
          New Sample
        </Link>
      </header>

      <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
        Sample list will be implemented in the next milestone.
      </div>
    </div>
  );
}
