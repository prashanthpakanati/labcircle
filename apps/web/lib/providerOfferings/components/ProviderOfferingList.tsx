// apps/web/lib/providerOfferings/components/ProviderOfferingList.tsx

"use client";

import React from "react";
import Link from "next/link";
import ProviderOfferingCard from "./ProviderOfferingCard";
import LoadingSkeleton from "./LoadingSkeleton";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import { useProviderOfferingsList } from "../hooks/useProviderOfferings";
import type { OfferingSearchFilters } from "../repositories/ProviderOfferingRepository";

interface ProviderOfferingListProps {
  providerId: string;
  locationId: string;
  filters?: OfferingSearchFilters;
  isAdmin?: boolean;
  pageSize?: number;
}

/**
 * Paginated list of Provider Offerings for a given location.
 * Uses cursor‑based pagination; renders a "Load more" button when more pages exist.
 */
export default function ProviderOfferingList({
  providerId,
  locationId,
  filters = {},
  isAdmin = false,
  pageSize = 20,
}: ProviderOfferingListProps) {
  const mergedFilters: OfferingSearchFilters = { providerLocationId: locationId, ...filters };
  const { offerings, loading, error, hasMore, loadMore, refresh } = useProviderOfferingsList(
    mergedFilters,
    pageSize
  );

  if (loading && offerings.length === 0) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} onRetry={refresh} />;
  if (!loading && offerings.length === 0) {
    return (
      <EmptyState
        title="No Offerings"
        description="No diagnostic service offerings have been created for this location yet."
        action={
          isAdmin ? (
            <Link
              href={`/providers/${providerId}/locations/${locationId}/offerings/new`}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              Add First Offering
            </Link>
          ) : undefined
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {offerings.map((offering) => (
          <ProviderOfferingCard
            key={offering.id}
            offering={offering}
            providerId={providerId}
            locationId={locationId}
            isAdmin={isAdmin}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-5 py-2 text-xs font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
