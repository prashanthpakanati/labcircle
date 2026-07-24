// apps/web/app/providers/[id]/locations/[locationId]/offerings/page.tsx

"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useProvider } from "../../../../../../lib/providers/hooks/useProvider";
import { useProviderLocation } from "../../../../../../lib/providers/hooks/useProviderLocation";
import ProviderOfferingList from "../../../../../../lib/providerOfferings/components/ProviderOfferingList";
import LoadingSkeleton from "../../../../../../lib/providerOfferings/components/LoadingSkeleton";
import ErrorState from "../../../../../../lib/providerOfferings/components/ErrorState";
import { useCurrentUser } from "../../../../../../src/lib/auth/hooks";
import { ArrowLeft, Plus, FlaskConical } from "lucide-react";
import { ProviderOfferingStatus } from "../../../../../../lib/providerOfferings/models/enums";

interface OfferingsPageProps {
  params: Promise<{ id: string; locationId: string }>;
}

/**
 * List view for all Provider Offerings at a specific location.
 * Route: /providers/[id]/locations/[locationId]/offerings
 */
export default function OfferingsPage(props: OfferingsPageProps) {
  const params = use(props.params);
  const providerId = params.id;
  const locationId = params.locationId;

  const user = useCurrentUser();
  const isAdmin = user ? user.role !== "patient" : false;

  const { data: provider, loading: providerLoading, error: providerError } = useProvider(providerId);
  const { data: location, loading: locationLoading, error: locationError } = useProviderLocation(locationId);

  const [statusFilter, setStatusFilter] = useState<ProviderOfferingStatus | "">("");

  if (providerLoading || locationLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <LoadingSkeleton />
      </div>
    );
  }

  if (providerError || locationError || !provider || !location) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <ErrorState
          message={providerError?.message || locationError?.message || "Location not found"}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <Link
        href={`/providers/${providerId}/locations/${locationId}`}
        className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5 mr-1" />
        Back to {location.displayName}
      </Link>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-indigo-600" />
            Service Offerings
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {provider.brandName} · {location.displayName}
          </p>
        </div>

        {isAdmin && (
          <Link
            href={`/providers/${providerId}/locations/${locationId}/offerings/new`}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Offering
          </Link>
        )}
      </div>

      {/* Status filter bar */}
      {isAdmin && (
        <div className="flex gap-2 flex-wrap">
          {(["", ProviderOfferingStatus.Draft, ProviderOfferingStatus.Published, ProviderOfferingStatus.Archived] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 text-[11px] font-semibold rounded-full border transition-colors ${
                statusFilter === s
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {s === "" ? "All" : s}
            </button>
          ))}
        </div>
      )}

      {/* Offering list */}
      <ProviderOfferingList
        providerId={providerId}
        locationId={locationId}
        filters={statusFilter ? { status: statusFilter } : {}}
        isAdmin={isAdmin}
      />
    </div>
  );
}
