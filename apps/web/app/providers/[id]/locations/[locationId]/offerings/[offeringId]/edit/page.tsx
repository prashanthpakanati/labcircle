// apps/web/app/providers/[id]/locations/[locationId]/offerings/[offeringId]/edit/page.tsx

"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProvider } from "../../../../../../../../lib/providers/hooks/useProvider";
import { useProviderLocation } from "../../../../../../../../lib/providers/hooks/useProviderLocation";
import { useProviderOffering, useProviderOfferingMutations } from "../../../../../../../../lib/providerOfferings/hooks/useProviderOfferings";
import ProviderOfferingForm from "../../../../../../../../lib/providerOfferings/components/ProviderOfferingForm";
import LoadingSkeleton from "../../../../../../../../lib/providerOfferings/components/LoadingSkeleton";
import ErrorState from "../../../../../../../../lib/providerOfferings/components/ErrorState";
import { useCurrentUser } from "../../../../../../../../src/lib/auth/hooks";
import type { ProviderOfferingFormData } from "../../../../../../../../lib/providerOfferings/models/form";
import { ArrowLeft, FlaskConical } from "lucide-react";

interface EditOfferingPageProps {
  params: Promise<{ id: string; locationId: string; offeringId: string }>;
}

/**
 * Edit form for an existing Provider Offering.
 * Route: /providers/[id]/locations/[locationId]/offerings/[offeringId]/edit
 */
export default function EditOfferingPage(props: EditOfferingPageProps) {
  const params = use(props.params);
  const { id: providerId, locationId, offeringId } = params;
  const router = useRouter();
  const user = useCurrentUser();
  const userId = user?.uid ?? "system_operator";

  const { data: provider, loading: providerLoading } = useProvider(providerId);
  const { data: location, loading: locationLoading } = useProviderLocation(locationId);
  const { offering, loading: offeringLoading, error } = useProviderOffering(offeringId);
  const { updateOffering, state } = useProviderOfferingMutations();

  const loading = providerLoading || locationLoading || offeringLoading;
  const detailPath = `/providers/${providerId}/locations/${locationId}/offerings/${offeringId}`;

  if (loading) return <div className="p-6 max-w-2xl mx-auto"><LoadingSkeleton /></div>;

  if (error || !offering || !provider || !location) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <ErrorState message={error || "Offering not found"} />
      </div>
    );
  }

  // Populate form defaults from the existing offering
  const defaultValues: Partial<ProviderOfferingFormData> = {
    priceConfiguration: { ...offering.priceConfiguration },
    availability: { ...offering.availability },
    homeCollectionSupported: offering.homeCollectionSupported,
    reportTatOverrideHours: offering.reportTatOverrideHours,
    durationOverrideMinutes: offering.durationOverrideMinutes,
    notes: offering.notes,
    displayOrder: offering.displayOrder,
    displayNameOverride: offering.displayNameOverride,
    status: offering.status,
  };

  const handleSubmit = async (data: ProviderOfferingFormData) => {
    const ok = await updateOffering(offeringId, data, {
      providerBrandName: provider.brandName,
      providerName: provider.legalName,
      providerCode: provider.code,
      serviceName: "",
      serviceCode: "",
      categoryId: "",
    }, userId);

    if (ok) {
      router.push(detailPath);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <Link
        href={detailPath}
        className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5 mr-1" />
        Back to Offering Details
      </Link>

      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-indigo-600" />
          Edit Offering
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          {provider.brandName} · {location.displayName}
        </p>
      </div>

      <ProviderOfferingForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={state.loading}
        serverError={state.error}
        submitLabel="Save Changes"
      />
    </div>
  );
}
