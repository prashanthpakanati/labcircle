// apps/web/app/providers/[id]/locations/[locationId]/offerings/new/page.tsx

"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProvider } from "../../../../../../../lib/providers/hooks/useProvider";
import { useProviderLocation } from "../../../../../../../lib/providers/hooks/useProviderLocation";
import ProviderOfferingForm from "../../../../../../../lib/providerOfferings/components/ProviderOfferingForm";
import LoadingSkeleton from "../../../../../../../lib/providerOfferings/components/LoadingSkeleton";
import ErrorState from "../../../../../../../lib/providerOfferings/components/ErrorState";
import { useProviderOfferingMutations } from "../../../../../../../lib/providerOfferings/hooks/useProviderOfferings";
import { useCurrentUser } from "../../../../../../../src/lib/auth/hooks";
import type { ProviderOfferingFormData } from "../../../../../../../lib/providerOfferings/models/form";
import { ArrowLeft, FlaskConical } from "lucide-react";

interface NewOfferingPageProps {
  params: Promise<{ id: string; locationId: string; diagnosticServiceId?: string }>;
}

/**
 * Create a new Provider Offering for a given location.
 * Route: /providers/[id]/locations/[locationId]/offerings/new
 *
 * NOTE: The diagnosticServiceId is expected as a query param in production.
 * For this sprint it can be manually supplied.
 */
export default function NewOfferingPage(props: NewOfferingPageProps) {
  const params = use(props.params);
  const providerId = params.id;
  const locationId = params.locationId;
  const router = useRouter();
  const user = useCurrentUser();
  const userId = user?.uid ?? "system_operator";

  const { data: provider, loading: providerLoading, error: providerError } = useProvider(providerId);
  const { data: location, loading: locationLoading, error: locationError } = useProviderLocation(locationId);
  const { createOffering, state } = useProviderOfferingMutations();

  // In practice this would come from a preceding service picker step or query param.
  const [diagnosticServiceId] = useState<string>("PLACEHOLDER_SERVICE_ID");

  if (providerLoading || locationLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <LoadingSkeleton />
      </div>
    );
  }

  if (providerError || locationError || !provider || !location) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <ErrorState message={providerError?.message || locationError?.message || "Location not found"} />
      </div>
    );
  }

  const handleSubmit = async (data: ProviderOfferingFormData) => {
    const result = await createOffering(
      locationId,
      diagnosticServiceId,
      data,
      {
        providerBrandName: provider.brandName,
        providerName: provider.legalName,
        providerCode: provider.code,
        serviceName: "", // to be populated from DiagnosticService catalog
        serviceCode: "",
        categoryId: "",
      },
      userId
    );

    if (result) {
      router.push(`/providers/${providerId}/locations/${locationId}/offerings/${result.id}`);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <Link
        href={`/providers/${providerId}/locations/${locationId}/offerings`}
        className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5 mr-1" />
        Back to Offerings
      </Link>

      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-indigo-600" />
          Add New Offering
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          {provider.brandName} · {location.displayName}
        </p>
      </div>

      <ProviderOfferingForm
        onSubmit={handleSubmit}
        isSubmitting={state.loading}
        serverError={state.error}
        submitLabel="Create Offering"
      />
    </div>
  );
}
