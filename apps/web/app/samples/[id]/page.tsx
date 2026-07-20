// apps/web/app/samples/[id]/page.tsx

"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface SampleDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * /samples/[id] — placeholder detail page.
 * Sample detail view will be implemented in a future milestone.
 */
export default function SampleDetailPage({ params }: SampleDetailPageProps) {
  const { id } = React.use(params);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="flex flex-col gap-2 mb-6">
        <Link
          href="/samples"
          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-slate-800 transition-colors"
          aria-label="Back to Samples"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          Back to Samples
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Sample Detail
        </h1>
        <p className="text-sm text-muted-foreground font-mono">ID: {id}</p>
      </header>

      <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
        Sample detail view will be implemented in the next milestone.
      </div>
    </div>
  );
}
