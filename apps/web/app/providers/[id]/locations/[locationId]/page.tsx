// apps/web/app/providers/[id]/locations/[locationId]/page.tsx

"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProvider } from "../../../../../lib/providers/hooks/useProvider";
import { useProviderLocation } from "../../../../../lib/providers/hooks/useProviderLocation";
import { ProviderRegistryService } from "../../../../../lib/providers/services/ProviderRegistryService";
import { VerificationStatus, ProviderStatus } from "../../../../../lib/providers/models/enums";
import OperatingHoursDisplay from "../../../../../lib/providers/components/OperatingHoursDisplay";
import AccreditationsDisplay from "../../../../../lib/providers/components/AccreditationsDisplay";
import LoadingSkeleton from "../../../../../lib/providers/components/LoadingSkeleton";
import ErrorState from "../../../../../lib/providers/components/ErrorState";
import { useCurrentUser } from "../../../../../src/lib/auth/hooks";
import { ArrowLeft, Building2, MapPin, Phone, Mail, ShieldCheck, ShieldAlert, Award, Bike, Trash2, Edit } from "lucide-react";

interface BranchPageProps {
  params: Promise<{ id: string; locationId: string }>;
}

export default function BranchDetailsPage(props: BranchPageProps) {
  const params = use(props.params);
  const providerId = params.id;
  const locationId = params.locationId;
  const router = useRouter();
  const user = useCurrentUser();
  const isAdmin = user ? user.role !== "patient" : false;
  const userId = user?.uid || "system_operator";

  // Data fetching hooks
  const { data: provider, loading: providerLoading, error: providerError } = useProvider(providerId);
  const { data: location, loading: locationLoading, error: locationError, refetch: refetchLocation } = useProviderLocation(locationId);

  // Verification pipeline states
  const [updatingVerify, setUpdatingVerify] = useState(false);

  const handleVerify = async (status: VerificationStatus) => {
    if (!confirm(`Are you sure you want to set the branch verification status to ${status}?`)) return;
    setUpdatingVerify(true);
    try {
      const service = new ProviderRegistryService();
      await service.verifyLocation(locationId, status, userId);
      await refetchLocation();
    } catch (err: unknown) {
      const errorObj = err as Error;
      alert(`Verification action failed: ${errorObj.message}`);
    } finally {
      setUpdatingVerify(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to soft-delete this branch location?")) return;
    try {
      const service = new ProviderRegistryService();
      await service.deleteLocation(locationId, userId);
      router.push(`/providers/${providerId}`);
    } catch (err: unknown) {
      const errorObj = err as Error;
      alert(`Deletion action failed: ${errorObj.message}`);
    }
  };

  if (providerLoading || locationLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <LoadingSkeleton />
      </div>
    );
  }

  if (providerError || locationError || !provider || !location) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <ErrorState error={providerError || locationError || new Error("Record not found")} onRetry={refetchLocation} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Link
        href={`/providers/${providerId}`}
        className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5 mr-1" />
        Back to {provider.brandName} Details
      </Link>

      {/* Header Info Banner */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-slate-900">{location.displayName}</h1>
            <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5 text-slate-400" />
              Corporate Network: {provider.brandName}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                {provider.providerType}
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                location.status === ProviderStatus.Active
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : "bg-slate-50 text-slate-700 border-slate-100"
              }`}>
                Branch: {location.status}
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                location.verificationStatus === VerificationStatus.Verified
                  ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                  : "bg-amber-50 text-amber-700 border-amber-100"
              }`}>
                Verification: {location.verificationStatus}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            {isAdmin && (
              <>
                <Link
                  href={`/providers/${providerId}/locations/${location.id}/edit`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit Branch Details
                </Link>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-100 rounded-lg transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Branch
                </button>
              </>
            )}
          </div>
        </div>

        {/* Address and details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-4 text-xs">
          <div className="space-y-3">
            <span className="font-bold text-slate-800 block text-sm">Branch Coordinates & Address</span>
            <div className="space-y-2 text-slate-600">
              <div className="flex gap-1.5">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  {location.address.streetAddress}, {location.address.area}, {location.city}, {location.state} - {location.postalCode}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-700">GPS Position:</span>
                <span className="font-mono">Lat {location.latitude.toFixed(6)}, Lng {location.longitude.toFixed(6)}</span>
              </div>
            </div>

            <span className="font-bold text-slate-800 block text-sm pt-2">Facilities Available</span>
            <div className="flex flex-wrap gap-1.5">
              {location.homeCollectionAvailable ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                  <Bike className="h-3.5 w-3.5" /> Home collection dispatch active
                </span>
              ) : (
                <span className="px-2.5 py-1 text-[10px] text-muted-foreground bg-slate-50 border rounded-full">No home collection</span>
              )}
              {location.parking && (
                <span className="px-2.5 py-1 text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 rounded-full">Car Parking</span>
              )}
              {location.wheelchairAccess && (
                <span className="px-2.5 py-1 text-[10px] font-semibold bg-slate-50 text-slate-700 border border-slate-200 rounded-full">Wheelchair Accessible</span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <span className="font-bold text-slate-800 block text-sm">Direct Contact Info</span>
            <div className="space-y-2 text-slate-600">
              <div className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>{location.contact.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>{location.contact.email}</span>
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider pt-2">
                Unique Branch ID: <span className="text-slate-600 font-semibold">{location.code}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Controls for Admins */}
        {isAdmin && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Branch Verification Panel</span>
              <span className="text-[10px] text-muted-foreground">
                Set verification status to activate or suspend this location on the patient booking app.
              </span>
            </div>
            <div className="flex gap-2">
              <button
                disabled={updatingVerify}
                onClick={() => handleVerify(VerificationStatus.Verified)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
              >
                <ShieldCheck className="h-4 w-4" /> Approve Branch
              </button>
              <button
                disabled={updatingVerify}
                onClick={() => handleVerify(VerificationStatus.Rejected)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
              >
                <ShieldAlert className="h-4 w-4" /> Reject Branch
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Operating schedule and Accreditations certifications details grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <OperatingHoursDisplay hours={location.operatingHours} />
        </div>
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 border-b pb-2">
            <Award className="h-4 w-4 text-indigo-600" />
            Licensing & Quality Accreditations
          </div>
          <AccreditationsDisplay records={location.accreditations} />
        </div>
      </div>
    </div>
  );
}
