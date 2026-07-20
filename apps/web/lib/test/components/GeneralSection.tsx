// apps/web/lib/test/components/GeneralSection.tsx

import React from "react";
import { Input } from "@/components/ui/input";
import { TestStatus } from "../models/enums";

interface GeneralSectionProps {
  name: string;
  code: string;
  status: TestStatus;
  errors: Record<string, string>;
  onChange: (field: string, value: string | number | boolean) => void;
}

export default function GeneralSection({
  name,
  code,
  status,
  errors,
  onChange,
}: GeneralSectionProps) {
  return (
    <div className="space-y-4 border border-border p-4 rounded-lg bg-white">
      <h3 className="text-sm font-semibold text-slate-800 border-b border-border pb-2">
        General Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Test Name */}
        <div className="space-y-1">
          <label htmlFor="test-name" className="text-xs font-medium text-slate-700">
            Test Name <span className="text-destructive">*</span>
          </label>
          <Input
            id="test-name"
            placeholder="e.g. Complete Blood Count (CBC)"
            value={name}
            onChange={(e) => onChange("name", e.target.value)}
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        {/* Test Code */}
        <div className="space-y-1">
          <label htmlFor="test-code" className="text-xs font-medium text-slate-700">
            Test Code <span className="text-destructive">*</span>
          </label>
          <Input
            id="test-code"
            placeholder="e.g. CBC01"
            value={code}
            onChange={(e) => onChange("code", e.target.value.toUpperCase())}
            aria-invalid={!!errors.code}
          />
          {errors.code && <p className="text-xs text-destructive">{errors.code}</p>}
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label htmlFor="test-status" className="text-xs font-medium text-slate-700">
            Status
          </label>
          <select
            id="test-status"
            value={status}
            onChange={(e) => onChange("status", e.target.value as TestStatus)}
            className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
          >
            {Object.values(TestStatus).map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
