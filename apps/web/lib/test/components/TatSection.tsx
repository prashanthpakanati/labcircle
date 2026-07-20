// apps/web/lib/test/components/TatSection.tsx

import React from "react";
import { Input } from "@/components/ui/input";

interface TatSectionProps {
  tatHours: number;
  urgentTatHours: number;
  errors: Record<string, string>;
  onChange: (field: string, value: string | number | boolean) => void;
}

export default function TatSection({
  tatHours,
  urgentTatHours,
  errors,
  onChange,
}: TatSectionProps) {
  const handleNumberInput = (field: string, rawVal: string) => {
    const parsed = rawVal === "" ? 0 : parseFloat(rawVal);
    onChange(field, isNaN(parsed) ? 0 : parsed);
  };

  return (
    <div className="space-y-4 border border-border p-4 rounded-lg bg-white">
      <h3 className="text-sm font-semibold text-slate-800 border-b border-border pb-2">
        Turnaround Time (TAT)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Normal TAT */}
        <div className="space-y-1">
          <label htmlFor="tat-hours" className="text-xs font-medium text-slate-700">
            Normal TAT (Hours) <span className="text-destructive">*</span>
          </label>
          <Input
            id="tat-hours"
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 24"
            value={tatHours === 0 && errors.tatHours ? "" : tatHours}
            onChange={(e) => handleNumberInput("tatHours", e.target.value)}
            aria-invalid={!!errors.tatHours}
          />
          {errors.tatHours && <p className="text-xs text-destructive">{errors.tatHours}</p>}
        </div>

        {/* Urgent TAT */}
        <div className="space-y-1">
          <label htmlFor="urgent-tat-hours" className="text-xs font-medium text-slate-700">
            Urgent TAT (Hours) <span className="text-destructive">*</span>
          </label>
          <Input
            id="urgent-tat-hours"
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 6"
            value={urgentTatHours === 0 && errors.urgentTatHours ? "" : urgentTatHours}
            onChange={(e) => handleNumberInput("urgentTatHours", e.target.value)}
            aria-invalid={!!errors.urgentTatHours}
          />
          {errors.urgentTatHours && <p className="text-xs text-destructive">{errors.urgentTatHours}</p>}
        </div>
      </div>
    </div>
  );
}
