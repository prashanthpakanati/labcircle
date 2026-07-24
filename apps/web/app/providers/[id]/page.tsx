// apps/web/app/providers/[id]/page.tsx

"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProvider } from "../../../lib/providers/hooks/useProvider";
import { useProviderLocations } from "../../../lib/providers/hooks/useProviderLocations";
import { ProviderRegistryService } from "../../../lib/providers/services/ProviderRegistryService";
import { VerificationStatus, ProviderStatus } from "../../../lib/providers/models/enums";
import LocationCard from "../../../lib/providers/components/LocationCard";
import LoadingSkeleton from "../../../lib/providers/components/LoadingSkeleton";
import ErrorState from "../../../lib/providers/components/ErrorState";
import EmptyState from "../../../lib/providers/components/EmptyState";
import { useCurrentUser } from "../../../src/lib/auth/hooks";
import { ProviderLocation } from "../../../lib/providers/models/types";
import { ArrowLeft, Building2, MapPin, Phone, Mail, Globe, ShieldCheck, ShieldAlert, Plus, Trash2, Edit } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProviderDetailsPage(props: PageProps) {
  const params = use(props.params);
  const providerId = params.id;
  const router = useRouter();
  const user = useCurrentUser();
  const isAdmin = user ? user.role !== "patient" : false;
  const userId = user?.uid || "system_operator";

  // Hooks data loading
  const { data: provider, loading: providerLoading, error: providerError, refetch: refetchProvider } = useProvider(providerId);
  const { data: locations, loading: locationsLoading, error: locationsError, refetch: refetchLocations } = useProviderLocations({ providerId });

  // Verification pipeline states
  const [updatingVerify, setUpdatingVerify] = useState(false);

  const handleVerify = async (status: VerificationStatus) => {
    if (!confirm(`Are you sure you want to set the verification status to ${status}?`)) return;
    setUpdatingVerify(true);
    try {
      const service = new ProviderRegistryService();
      await service.verifyProvider(providerId, status, userId);
      await refetchProvider();
    } catch (err: unknown) {
      const errorObj = err as Error;
      alert(`Verification action failed: ${errorObj.message}`);
    } finally {
      setUpdatingVerify(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to soft-delete this corporate provider network? This will flag it as deleted in all customer registries.")) return;
    try {
      const service = new ProviderRegistryService();
      await service.deleteProvider(providerId, userId);
      router.push("/providers");
    } catch (err: unknown) {
      const errorObj = err as Error;
      alert(`Deletion action failed: ${errorObj.message}`);
    }
  };

  if (providerLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <LoadingSkeleton />
      </div>
    );
  }

  if (providerError || !provider) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <ErrorState error={providerError || new Error("Provider corporate record not found")} onRetry={refetchProvider} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Link
        href="/providers"
        className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5 mr-1" />
        Back to Registry Catalog
      </Link>

      {/* Corporate Profile Header */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex gap-4">
            <div className="p-4 bg-slate-50 text-slate-600 rounded-xl shrink-0">
              <Building2 className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-slate-900">{provider.brandName}</h1>
              <p className="text-xs text-muted-foreground font-semibold">{provider.legalName}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                  {provider.providerType}
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                  provider.status === ProviderStatus.Active
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : "bg-amber-50 text-amber-700 border-amber-100"
                }`}>
                  {provider.status}
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                  provider.verificationStatus === VerificationStatus.Verified
                    ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                    : provider.verificationStatus === VerificationStatus.Pending
                    ? "bg-amber-50 text-amber-700 border-amber-100"
                    : "bg-rose-50 text-rose-700 border-rose-100"
                }`}>
                  {provider.verificationStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {isAdmin && (
              <>
                <Link
                  href={`/providers/${provider.id}/edit`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit corporate
                </Link>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-100 rounded-lg transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Provider
                </button>
              </>
            )}
          </div>
        </div>

        <div className="text-xs text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
          {provider.description || "No corporate description provided."}
        </div>

        {/* Corporate Metadata details grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-4 text-xs">
          <div className="space-y-1.5">
            <span className="font-bold text-slate-800 block">Corporate Address</span>
            <div className="flex gap-1.5 text-slate-600">
              <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                {provider.corporateAddress.streetAddress}, {provider.corporateAddress.area}, {provider.corporateAddress.city}, {provider.corporateAddress.state} - {provider.corporateAddress.postalCode}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="font-bold text-slate-800 block">Contact Info</span>
            <div className="space-y-1 text-slate-600">
              <div className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>{provider.corporateContact.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>{provider.corporateContact.email}</span>
              </div>
              {provider.website && (
                <div className="flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-slate-400" />
                  <a href={provider.website} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                    {provider.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="font-bold text-slate-800 block">Tax & Registration</span>
            <div className="space-y-1 text-slate-600">
              <div>PAN: <span className="font-mono text-slate-800 uppercase font-semibold">{provider.panNumber || "N/A"}</span></div>
              <div>GSTIN: <span className="font-mono text-slate-800 uppercase font-semibold">{provider.gstNumber || "N/A"}</span></div>
              <div>Registry Code: <span className="font-mono text-slate-800 uppercase font-semibold">{provider.code}</span></div>
            </div>
          </div>
        </div>

        {/* Verification Controls for Admins */}
        {isAdmin && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Administrative Verification Panel</span>
              <span className="text-[10px] text-muted-foreground">
                Set verification status to activate or suspend provider branches across the platform.
              </span>
            </div>
            <div className="flex gap-2">
              <button
                disabled={updatingVerify}
                onClick={() => handleVerify(VerificationStatus.Verified)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
              >
                <ShieldCheck className="h-4 w-4" /> Verify
              </button>
              <button
                disabled={updatingVerify}
                onClick={() => handleVerify(VerificationStatus.Rejected)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
              >
                <ShieldAlert className="h-4 w-4" /> Reject
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Locations / Branches Panel */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Branch Locations</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Physical testing labs and scan facility addresses operating under this provider.
            </p>
          </div>
          {isAdmin && (
            <Link
              href={`/providers/${provider.id}/locations/new`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Branch Location
            </Link>
          )}
        </div>

        {locationsLoading ? (
          <LoadingSkeleton />
        ) : locationsError ? (
          <ErrorState error={locationsError} onRetry={refetchLocations} />
        ) : !locations || locations.length === 0 ? (
          <EmptyState
            title="No Branches Registered"
            description="There are no active branches or operational labs registered under this corporate provider."
            action={
              isAdmin ? (
                <Link href={`/providers/${provider.id}/locations/new`} className="text-xs font-bold text-indigo-600 hover:underline">
                  Register the first branch location
                </Link>
              ) : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((loc: ProviderLocation) => (
              <LocationCard key={loc.id} location={loc} isAdmin={isAdmin} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
