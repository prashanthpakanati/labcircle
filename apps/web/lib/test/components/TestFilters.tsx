// apps/web/lib/test/components/TestFilters.tsx

"use client";

import React from "react";
import { TestDepartment, TestCategory, TestStatus } from "../models/enums";

export interface FilterState {
  category: string;
  department: string;
  status: string;
  homeCollection: string;
}

interface TestFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export default function TestFilters({ filters, onChange }: TestFiltersProps) {
  const handleSelectChange = (key: keyof FilterState, value: string) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Department Filter */}
      <div className="flex flex-col gap-1">
        <label htmlFor="dept-filter" className="text-xs font-semibold text-muted-foreground">Department</label>
        <select
          id="dept-filter"
          value={filters.department}
          onChange={(e) => handleSelectChange("department", e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="All">All Departments</option>
          {Object.values(TestDepartment).map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div className="flex flex-col gap-1">
        <label htmlFor="category-filter" className="text-xs font-semibold text-muted-foreground">Category</label>
        <select
          id="category-filter"
          value={filters.category}
          onChange={(e) => handleSelectChange("category", e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="All">All Categories</option>
          {Object.values(TestCategory).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div className="flex flex-col gap-1">
        <label htmlFor="status-filter" className="text-xs font-semibold text-muted-foreground">Status</label>
        <select
          id="status-filter"
          value={filters.status}
          onChange={(e) => handleSelectChange("status", e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="All">All Statuses</option>
          {Object.values(TestStatus).map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Home Collection Filter */}
      <div className="flex flex-col gap-1">
        <label htmlFor="hc-filter" className="text-xs font-semibold text-muted-foreground">Home Collection</label>
        <select
          id="hc-filter"
          value={filters.homeCollection}
          onChange={(e) => handleSelectChange("homeCollection", e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="All">All Options</option>
          <option value="Yes">Home Collection Only</option>
          <option value="No">Lab Collection Only</option>
        </select>
      </div>
    </div>
  );
}
