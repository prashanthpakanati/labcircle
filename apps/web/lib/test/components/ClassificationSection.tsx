// apps/web/lib/test/components/ClassificationSection.tsx

import React from "react";
import { TestDepartment, TestCategory } from "../models/enums";

interface ClassificationSectionProps {
  department: TestDepartment;
  category: TestCategory;
  errors: Record<string, string>;
  onChange: (field: string, value: string | number | boolean) => void;
}

export default function ClassificationSection({
  department,
  category,
  errors,
  onChange,
}: ClassificationSectionProps) {
  return (
    <div className="space-y-4 border border-border p-4 rounded-lg bg-white">
      <h3 className="text-sm font-semibold text-slate-800 border-b border-border pb-2">
        Classification
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Department */}
        <div className="space-y-1">
          <label htmlFor="test-department" className="text-xs font-medium text-slate-700">
            Department <span className="text-destructive">*</span>
          </label>
          <select
            id="test-department"
            value={department}
            onChange={(e) => onChange("department", e.target.value as TestDepartment)}
            className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            aria-invalid={!!errors.department}
          >
            {Object.values(TestDepartment).map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {errors.department && <p className="text-xs text-destructive">{errors.department}</p>}
        </div>

        {/* Category */}
        <div className="space-y-1">
          <label htmlFor="test-category" className="text-xs font-medium text-slate-700">
            Category <span className="text-destructive">*</span>
          </label>
          <select
            id="test-category"
            value={category}
            onChange={(e) => onChange("category", e.target.value as TestCategory)}
            className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            aria-invalid={!!errors.category}
          >
            {Object.values(TestCategory).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
        </div>
      </div>
    </div>
  );
}
