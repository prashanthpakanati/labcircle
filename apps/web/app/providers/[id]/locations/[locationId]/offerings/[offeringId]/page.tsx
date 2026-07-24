// apps/web/app/providers/[id]/locations/[locationId]/offerings/[offeringId]/page.tsx

"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProvider } from "../../../../../../../lib/providers/hooks/useProvider";
import { useProviderLocation } from "../../../../../../../lib/providers/hooks/useProviderLocation";
import { useProviderOffering, useProviderOfferingMutations } from "../../../../../../../lib/providerOfferings/hooks/useProviderOfferings";
import LoadingSkeleton from "../../../../../../../lib/providerOfferings/components/LoadingSkeleton";
import ErrorState from "../../../../../../../lib/providerOfferings/components/ErrorState";
import { useCurrentUser } from "../../../../../../../src/lib/auth/hooks";
import { ProviderOfferingStatus } from "../../../../../../../lib/providerOfferings/models/enums";
import type { AppRole } from "../../../../../../../lib/providerOfferings/services/ProviderOfferingService";
import {
  ArrowLeft, Edit, Trash2, Archive, RotateCcw, IndianRupee,
  CheckCircle2, Clock, Wifi, Home, FlaskConical
} from "lucide-react";

interface OfferingDetailPageProps {
  params: Promise<{ id: string; locationId: string; offeringId: string }>;
}

/**
 * Detail view for a single Provider Offering.
 * Route: /providers/[id]/locations/[locationId]/offerings/[offeringId]
 */
export default function OfferingDetailPage(props: OfferingDetailPageProps) {
  const params = use(props.params);
  const { id: providerId, locationId, offeringId } = params;
  const router = useRouter();
  const user = useCurrentUser();
  const userId = user?.uid ?? "system_operator";
  const userRole: AppRole = (user?.role as AppRole) ?? "Viewer";
  const isAdmin = userRole !== "Viewer";

  const { data: provider, loading: providerLoading } = useProvider(providerId);
  const { data: location, loading: locationLoading } = useProviderLocation(locationId);
  const { offering, loading: offeringLoading, error, refresh } = useProviderOffering(offeringId);
  const { archiveOffering, restoreOffering, deleteOffering, transitionStatus, state } = useProviderOfferingMutations();

  const loading = providerLoading || locationLoading || offeringLoading;

  if (loading) return <div className="p-6 max-w-4xl mx-auto"><LoadingSkeleton /></div>;

  if (error || !offering) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <ErrorState message={error || "Offering not found"} onRetry={refresh} />
      </div>
    );
  }

  const price = offering.priceConfiguration;
  const listPath = `/providers/${providerId}/locations/${locationId}/offerings`;

  const handlePublish = async () => {
    if (!confirm("Publish this offering? It will be visible to patients.")) return;
    const ok = await transitionStatus(offeringId, ProviderOfferingStatus.Published, userId, userRole);
    if (ok) refresh();
  };

  const handleArchive = async () => {
    if (!confirm("Archive this offering? It will no longer be visible to patients.")) return;
    const ok = await archiveOffering(offeringId, userId, userRole);
    if (ok) refresh();
  };

  const handleRestore = async () => {
    const ok = await restoreOffering(offeringId, userId, userRole);
    if (ok) refresh();
  };

  const handleDelete = async () => {
    if (!confirm("Permanently soft-delete this offering? This action cannot be undone easily.")) return;
    const ok = await deleteOffering(offeringId, userId, userRole);
    if (ok) router.push(listPath);
  };

  const displayName = offering.displayNameOverride ?? offering.searchKeywords[0] ?? "Offering";

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Link href={listPath} className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-slate-800 transition-colors">
        <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Offerings
      </Link>

      {/* Header card */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
              <FlaskConical className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{displayName}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {provider?.brandName} · {location?.displayName}
              </p>
            </div>
          </div>

          {/* Status badge */}
          <div className="flex flex-wrap gap-2 items-center">
            {offering.status === ProviderOfferingStatus.Published && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                <CheckCircle2 className="h-3 w-3" /> Published
              </span>
            )}
            {offering.status === ProviderOfferingStatus.Draft && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold bg-amber-50 text-amber-700 rounded-full border border-amber-100">
                <Clock className="h-3 w-3" /> Draft
              </span>
            )}
            {offering.status === ProviderOfferingStatus.Archived && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold bg-slate-100 text-slate-500 rounded-full border border-slate-200">
                <Archive className="h-3 w-3" /> Archived
              </span>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="border-t border-slate-100 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">MRP</p>
            <p className="font-bold text-slate-800 text-base flex items-center">
              <IndianRupee className="h-3.5 w-3.5" />{price.mrp.toLocaleString("en-IN")}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Selling Price</p>
            <p className="font-bold text-indigo-700 text-base flex items-center">
              <IndianRupee className="h-3.5 w-3.5" />{price.sellingPrice.toLocaleString("en-IN")}
            </p>
          </div>
          {price.memberPrice !== undefined && (
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Member Price</p>
              <p className="font-semibold text-teal-700 flex items-center">
                <IndianRupee className="h-3 w-3" />{price.memberPrice.toLocaleString("en-IN")}
              </p>
            </div>
          )}
          {price.offerPrice !== undefined && (
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Offer Price</p>
              <p className="font-semibold text-rose-600 flex items-center">
                <IndianRupee className="h-3 w-3" />{price.offerPrice.toLocaleString("en-IN")}
              </p>
            </div>
          )}
        </div>

        {/* Availability flags */}
        <div className="flex flex-wrap gap-2">
          {offering.availability.onlineBookable && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              <Wifi className="h-3 w-3" /> Online Booking
            </span>
          )}
          {offering.homeCollectionSupported && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
              <Home className="h-3 w-3" /> Home Collection
            </span>
          )}
          {!offering.availability.enabled && (
            <span className="text-[10px] text-slate-400 italic">Offering currently disabled</span>
          )}
        </div>

        {offering.notes && (
          <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 border border-slate-100">
            <span className="font-semibold block mb-1 text-slate-700">Internal Notes</span>
            {offering.notes}
          </div>
        )}

        {/* Admin action bar */}
        {isAdmin && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            <Link
              href={`${listPath}/${offeringId}/edit`}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
            >
              <Edit className="h-3.5 w-3.5" /> Edit
            </Link>

            {offering.status === ProviderOfferingStatus.Draft && (
              <button
                disabled={state.loading}
                onClick={handlePublish}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Publish
              </button>
            )}

            {offering.status === ProviderOfferingStatus.Published && (
              <button
                disabled={state.loading}
                onClick={handleArchive}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
              >
                <Archive className="h-3.5 w-3.5" /> Archive
              </button>
            )}

            {offering.status === ProviderOfferingStatus.Archived && (
              <button
                disabled={state.loading}
                onClick={handleRestore}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Restore to Draft
              </button>
            )}

            <button
              disabled={state.loading}
              onClick={handleDelete}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-lg transition-colors ml-auto"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        )}

        {state.error && (
          <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
            {state.error}
          </p>
        )}
      </div>
    </div>
  );
}
