// apps/web/app/imaging/services/page.tsx

"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useImagingCategories } from "../../../lib/imaging/hooks/useImagingCategories";
import { useImagingServices } from "../../../lib/imaging/hooks/useImagingServices";
import ServiceSearch from "../../../lib/imaging/components/ServiceSearch";
import ServiceList from "../../../lib/imaging/components/ServiceList";
import LoadingSkeleton from "../../../lib/imaging/components/LoadingSkeleton";
import ErrorState from "../../../lib/imaging/components/ErrorState";
import EmptyState from "../../../lib/imaging/components/EmptyState";
import { ArrowLeft } from "lucide-react";

function ServiceCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get("categoryId") || "ALL";

  // Categories hook
  const { data: categories, error: categoriesError } = useImagingCategories();

  // Search & filter states
  const [searchVal, setSearchVal] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedModality, setSelectedModality] = useState("ALL");
  const [fastingFilter, setFastingFilter] = useState("ALL");
  const [contrastFilter, setContrastFilter] = useState("ALL");
  const [showInactive, setShowInactive] = useState(false);

  // Sync category parameter from URL if present
  useEffect(() => {
    if (initialCategoryParam && initialCategoryParam !== "ALL") {
      setSelectedCategory(initialCategoryParam);
    }
  }, [initialCategoryParam]);

  // Compute filter payload for services hook query
  const queryFilters = useMemo(() => {
    return {
      categoryId: selectedCategory !== "ALL" ? selectedCategory : undefined,
      modality: selectedModality !== "ALL" ? selectedModality : undefined,
      search: searchVal ? searchVal : undefined,
      activeOnly: !showInactive,
      fastingRequired: fastingFilter === "REQUIRED" ? true : fastingFilter === "NOT_REQUIRED" ? false : undefined,
      contrastRequired: contrastFilter === "REQUIRED" ? true : contrastFilter === "NOT_REQUIRED" ? false : undefined,
    };
  }, [selectedCategory, selectedModality, searchVal, showInactive, fastingFilter, contrastFilter]);

  // Services hook
  const { data: services, loading, error, refetch } = useImagingServices(queryFilters);

  // Determine if filters are currently active (for Clear button display)
  const isFilterActive = useMemo(() => {
    return (
      selectedCategory !== "ALL" ||
      selectedModality !== "ALL" ||
      searchVal !== "" ||
      fastingFilter !== "ALL" ||
      contrastFilter !== "ALL" ||
      showInactive
    );
  }, [selectedCategory, selectedModality, searchVal, fastingFilter, contrastFilter, showInactive]);

  // Clear filters handler
  const handleClearFilters = () => {
    setSearchVal("");
    setSelectedCategory("ALL");
    setSelectedModality("ALL");
    setFastingFilter("ALL");
    setContrastFilter("ALL");
    setShowInactive(false);
  };

  return (
    <div className="space-y-6">
      {/* Search and filter controller panel */}
      {categories && (
        <ServiceSearch
          categories={categories}
          searchVal={searchVal}
          onSearchChange={setSearchVal}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedModality={selectedModality}
          onModalityChange={setSelectedModality}
          fastingFilter={fastingFilter}
          onFastingChange={setFastingFilter}
          contrastFilter={contrastFilter}
          onContrastChange={setContrastFilter}
          showInactive={showInactive}
          onToggleInactive={() => setShowInactive((prev) => !prev)}
          onClearFilters={handleClearFilters}
          isFilterActive={isFilterActive}
        />
      )}

      {/* Renders result catalog grid */}
      {loading ? (
        <LoadingSkeleton />
      ) : error || categoriesError ? (
        <ErrorState error={error || categoriesError || new Error("Failed to load catalog")} onRetry={refetch} />
      ) : !services || services.length === 0 ? (
        <EmptyState
          title="No Services Found"
          description="We couldn't find any diagnostic imaging services matching your search or filters."
          action={
            isFilterActive ? (
              <button
                onClick={handleClearFilters}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Clear all active search filters
              </button>
            ) : undefined
          }
        />
      ) : (
        <ServiceList services={services} categories={categories || []} />
      )}
    </div>
  );
}

export default function BrowseServicesPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Navigation & Header */}
      <div className="space-y-4">
        <Link
          href="/imaging"
          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-slate-800 transition-colors"
          aria-label="Back to Imaging Hub"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          Back to Imaging Hub
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Imaging Services Catalog
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Search and read patient guidance for predefined radiology diagnostic procedures.
          </p>
        </div>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <ServiceCatalogContent />
      </Suspense>
    </div>
  );
}
