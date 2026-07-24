// apps/web/app/providers/page.tsx

"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useProviders } from "../../lib/providers/hooks/useProviders";
import ProviderCard from "../../lib/providers/components/ProviderCard";
import LoadingSkeleton from "../../lib/providers/components/LoadingSkeleton";
import ErrorState from "../../lib/providers/components/ErrorState";
import EmptyState from "../../lib/providers/components/EmptyState";
import { ProviderType } from "../../lib/providers/models/enums";
import { useCurrentUser } from "../../src/lib/auth/hooks";
import { Plus, Search, Building2 } from "lucide-react";

function ProvidersCatalogContent() {
  const user = useCurrentUser();
  const isAdmin = user ? user.role !== "patient" : false;

  const [searchVal, setSearchVal] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [showInactive, setShowInactive] = useState(false);

  const queryFilters = useMemo(() => {
    return {
      search: searchVal ? searchVal : undefined,
      type: selectedType !== "ALL" ? (selectedType as ProviderType) : undefined,
    };
  }, [searchVal, selectedType]);

  const { data: providers, loading, error, refetch } = useProviders(queryFilters, {
    includeDeleted: showInactive,
  });

  const isFilterActive = useMemo(() => {
    return searchVal !== "" || selectedType !== "ALL" || showInactive;
  }, [searchVal, selectedType, showInactive]);

  const handleClearFilters = () => {
    setSearchVal("");
    setSelectedType("ALL");
    setShowInactive(false);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls Panel */}
      <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search providers by registry code, legal name, or brand name..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="w-full md:w-56">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              <option value="ALL">All Specializations</option>
              <option value={ProviderType.ImagingCenter}>Imaging Centers</option>
              <option value={ProviderType.Laboratory}>Diagnostic Laboratories</option>
              <option value={ProviderType.Hospital}>Hospitals</option>
              <option value={ProviderType.Clinic}>Clinics</option>
              <option value={ProviderType.PhlebotomyAgency}>Home Collection Agencies</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-50">
          <div className="flex items-center gap-4">
            {isAdmin && (
              <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                />
                Show soft-deleted providers
              </label>
            )}
          </div>

          {isFilterActive && (
            <button
              onClick={handleClearFilters}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Corporate List Grid */}
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : !providers || providers.length === 0 ? (
        <EmptyState
          title="No Registered Providers Found"
          description="We couldn't find any verified networks matching your query criteria."
          action={
            isFilterActive ? (
              <button
                onClick={handleClearFilters}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                Clear all search filters
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProvidersCatalogPage() {
  const user = useCurrentUser();
  const isAdmin = user ? user.role !== "patient" : false;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-indigo-600" />
            Healthcare Provider Registry
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Directory of corporate networks, hospitals, labs, and diagnostic hubs associated with LabCircle.
          </p>
        </div>

        {isAdmin && (
          <Link
            href="/providers/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow transition-colors"
          >
            <Plus className="h-4 w-4" />
            Register Corporate Provider
          </Link>
        )}
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <ProvidersCatalogContent />
      </Suspense>
    </div>
  );
}
