// apps/web/lib/sample/components/CreateSampleHeader.tsx

"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, TestTube2 } from "lucide-react";

export default function CreateSampleHeader() {
  return (
    <header className="flex flex-col gap-2">
      <Link
        href="/samples"
        className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-slate-800 transition-colors"
        aria-label="Back to Samples"
      >
        <ArrowLeft className="h-3.5 w-3.5 mr-1" />
        Back to Samples
      </Link>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600">
          <TestTube2 className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Create Sample Collection
          </h1>
          <p className="text-sm text-muted-foreground">
            Initiate sample collection from an existing lab order.
          </p>
        </div>
      </div>
    </header>
  );
}
