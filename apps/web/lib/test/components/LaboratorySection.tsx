// apps/web/lib/test/components/LaboratorySection.tsx

import React from "react";
import { Input } from "@/components/ui/input";

interface LaboratorySectionProps {
  specimenType: string;
  method: string;
  homeCollection: boolean;
  errors: Record<string, string>;
  onChange: (field: string, value: string | number | boolean) => void;
}

export default function LaboratorySection({
  specimenType,
  method,
  homeCollection,
  errors,
  onChange,
}: LaboratorySectionProps) {
  return (
    <div className="space-y-4 border border-border p-4 rounded-lg bg-white">
      <h3 className="text-sm font-semibold text-slate-800 border-b border-border pb-2">
        Laboratory Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Specimen Type */}
        <div className="space-y-1">
          <label htmlFor="specimen-type" className="text-xs font-medium text-slate-700">
            Specimen Type <span className="text-destructive">*</span>
          </label>
          <Input
            id="specimen-type"
            placeholder="e.g. Whole Blood, EDTA Tube"
            value={specimenType}
            onChange={(e) => onChange("specimenType", e.target.value)}
            aria-invalid={!!errors.specimenType}
          />
          {errors.specimenType && <p className="text-xs text-destructive">{errors.specimenType}</p>}
        </div>

        {/* Method */}
        <div className="space-y-1">
          <label htmlFor="test-method" className="text-xs font-medium text-slate-700">
            Method <span className="text-destructive">*</span>
          </label>
          <Input
            id="test-method"
            placeholder="e.g. Automated Hematology Analyzer"
            value={method}
            onChange={(e) => onChange("method", e.target.value)}
            aria-invalid={!!errors.method}
          />
          {errors.method && <p className="text-xs text-destructive">{errors.method}</p>}
        </div>

        {/* Home Collection */}
        <div className="space-y-1 md:col-span-2 flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="home-collection"
            checked={homeCollection}
            onChange={(e) => onChange("homeCollection", e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
          />
          <label htmlFor="home-collection" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
            Eligible for Home Collection
          </label>
        </div>
      </div>
    </div>
  );
}
