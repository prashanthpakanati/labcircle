// apps/web/lib/sample/components/SampleDetailsHeader.tsx

"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sample } from "../models/types";
import SampleStatusBadge from "./SampleStatusBadge";
import SampleStatusActions from "./SampleStatusActions";
import { ArrowLeft, Edit, Printer, TestTube2 } from "lucide-react";

interface SampleDetailsHeaderProps {
  sample: Sample;
  onStatusUpdated?: () => void;
}

export default function SampleDetailsHeader({
  sample,
  onStatusUpdated = () => {},
}: SampleDetailsHeaderProps) {
  const formattedDate = new Date(sample.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="flex flex-col gap-4 border-b border-border pb-6">
      <div className="flex items-center justify-between">
        <Link
          href="/samples"
          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-slate-800 transition-colors"
          aria-label="Back to Samples"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          Back to Samples
        </Link>

        {/* Read-Only Disabled Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled
            className="h-8 text-xs gap-1.5 opacity-60 cursor-not-allowed"
            title="Editing is disabled in read-only mode"
          >
            <Edit className="h-3.5 w-3.5" />
            Edit Sample
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled
            className="h-8 text-xs gap-1.5 opacity-60 cursor-not-allowed"
            title="Printing barcode is disabled"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Barcode
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-600">
            <TestTube2 className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
                {sample.displayId}
              </h1>
              <SampleStatusBadge status={sample.status} />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Created on <time dateTime={sample.createdAt}>{formattedDate}</time>
            </p>
          </div>
        </div>

        {/* Controlled Dynamic Workflow Status Action Buttons */}
        <SampleStatusActions
          sampleId={sample.id}
          currentStatus={sample.status}
          onStatusUpdated={onStatusUpdated}
        />
      </div>
    </header>
  );
}
