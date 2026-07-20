// apps/web/app/tests/list/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useTests } from "../../../lib/test/hooks/useTests";
import TestHeader from "../../../lib/test/components/TestHeader";
import TestTable from "../../../lib/test/components/TestTable";
import TestCard from "../../../lib/test/components/TestCard";
import TestSearch from "../../../lib/test/components/TestSearch";
import TestFilters, { FilterState } from "../../../lib/test/components/TestFilters";
import TestActions, { SortField, SortOrder } from "../../../lib/test/components/TestActions";
import LoadingSkeleton from "../../../lib/test/components/LoadingSkeleton";
import ErrorState from "../../../lib/test/components/ErrorState";
import EmptyState from "../../../lib/test/components/EmptyState";
import { paginateItems } from "../../../lib/shared/utils/paginateItems";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const PAGE_SIZE = 10;

const initialFilters: FilterState = {
  category: "All",
  department: "All",
  status: "All",
  homeCollection: "All",
};

export default function TestListPage() {
  const { data: tests, loading, error } = useTests();

  // Search, Filter, Sort, Paginate States
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [page, setPage] = useState(1);

  // Check if any filters are active (excluding defaults)
  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery !== "" ||
      filters.category !== "All" ||
      filters.department !== "All" ||
      filters.status !== "All" ||
      filters.homeCollection !== "All"
    );
  }, [searchQuery, filters]);

  // Client-side Filter & Sort
  const filteredAndSortedTests = useMemo(() => {
    if (!tests) return [];

    let result = [...tests];

    // Search by Name, Code, DisplayID
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q) ||
          t.displayId.toLowerCase().includes(q)
      );
    }

    // Category Filter
    if (filters.category !== "All") {
      result = result.filter((t) => t.category === filters.category);
    }

    // Department Filter
    if (filters.department !== "All") {
      result = result.filter((t) => t.department === filters.department);
    }

    // Status Filter
    if (filters.status !== "All") {
      result = result.filter((t) => t.status === filters.status);
    }

    // Home Collection Filter
    if (filters.homeCollection !== "All") {
      const target = filters.homeCollection === "Yes";
      result = result.filter((t) => t.homeCollection === target);
    }

    // Sorting
    result.sort((a, b) => {
      let valA: string | number | boolean = a[sortField];
      let valB: string | number | boolean = b[sortField];

      // Safe string normalization for sorting
      if (typeof valA === "string" && typeof valB === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [tests, searchQuery, filters, sortField, sortOrder]);

  // Paginated subset
  const totalPages = Math.ceil(filteredAndSortedTests.length / PAGE_SIZE);

  const paginatedTests = useMemo(() => {
    return paginateItems(filteredAndSortedTests, page, PAGE_SIZE);
  }, [filteredAndSortedTests, page]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setFilters(initialFilters);
    setSortField("name");
    setSortOrder("asc");
    setPage(1);
  };

  // Reset pagination to page 1 when search query or filters change
  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, filters]);

  // Adjust page number if filtered list size drops
  React.useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-4">
        <TestHeader />
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-4">
        <TestHeader />
        <ErrorState error={error} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Navigation & Header */}
      <div className="flex flex-col gap-2">
        <Link href="/tests" className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-slate-800 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          Back to Dashboard
        </Link>
        <TestHeader />
      </div>

      {/* Toolbar / Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-slate-50 p-4 rounded-lg border border-border">
        <div className="flex-1 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <span className="text-xs font-semibold text-muted-foreground block mb-1">Search Catalog</span>
            <TestSearch onSearch={setSearchQuery} defaultValue={searchQuery} />
          </div>
          <TestFilters filters={filters} onChange={setFilters} />
        </div>
        <TestActions
          sortField={sortField}
          sortOrder={sortOrder}
          onSortFieldChange={setSortField}
          onSortOrderChange={setSortOrder}
          onReset={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Content Area */}
      {filteredAndSortedTests.length === 0 ? (
        <div className="py-12 border border-dashed rounded-lg">
          <EmptyState
            title="No tests found"
            description={
              hasActiveFilters
                ? "Try adjusting your search query or filters to find what you are looking for."
                : "The test catalog is currently empty."
            }
            action={
              hasActiveFilters ? (
                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                  Clear Filters
                </Button>
              ) : undefined
            }
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <TestTable tests={paginatedTests} />
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {paginatedTests.map((t) => (
              <TestCard key={t.id} test={t} />
            ))}
          </div>

          {/* External Pagination Footer (for sync on desktop and mobile layout) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
              <span className="text-xs text-muted-foreground select-none">
                Showing {Math.min(filteredAndSortedTests.length, (page - 1) * PAGE_SIZE + 1)}-
                {Math.min(filteredAndSortedTests.length, page * PAGE_SIZE)} of {filteredAndSortedTests.length} tests
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="h-8 text-xs"
                >
                  Previous
                </Button>
                <span className="text-xs text-muted-foreground select-none px-1">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="h-8 text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
