// apps/web/lib/test/components/TestActions.tsx

"use client";

import React from "react";
import { ArrowUpDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export type SortField = "name" | "department" | "labCirclePrice" | "tatHours" | "status";
export type SortOrder = "asc" | "desc";

interface TestActionsProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortFieldChange: (field: SortField) => void;
  onSortOrderChange: (order: SortOrder) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export default function TestActions({
  sortField,
  sortOrder,
  onSortFieldChange,
  onSortOrderChange,
  onReset,
  hasActiveFilters,
}: TestActionsProps) {
  const toggleOrder = () => {
    onSortOrderChange(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Sorting field */}
      <div className="flex flex-col gap-1">
        <label htmlFor="sort-field" className="text-xs font-semibold text-muted-foreground">Sort By</label>
        <div className="flex items-center gap-1">
          <select
            id="sort-field"
            value={sortField}
            onChange={(e) => onSortFieldChange(e.target.value as SortField)}
            className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="name">Name</option>
            <option value="department">Department</option>
            <option value="labCirclePrice">Price (LabCircle)</option>
            <option value="tatHours">TAT (Hours)</option>
            <option value="status">Status</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleOrder}
            className="h-9 w-9 p-0 flex items-center justify-center"
            title={`Sort ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
            aria-label={`Sort ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Reset button */}
      {hasActiveFilters && (
        <div className="flex flex-col gap-1 justify-end self-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-9 text-xs text-destructive hover:text-destructive/80 gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        </div>
      )}
    </div>
  );
}
