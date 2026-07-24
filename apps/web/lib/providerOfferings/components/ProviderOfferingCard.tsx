// apps/web/lib/providerOfferings/components/ProviderOfferingCard.tsx

"use client";

import React from "react";
import Link from "next/link";
import { FlaskConical, CheckCircle2, Clock, Archive, IndianRupee, Home, Wifi } from "lucide-react";
import { ProviderOffering } from "../models/types";
import { ProviderOfferingStatus } from "../models/enums";

interface ProviderOfferingCardProps {
  offering: ProviderOffering;
  providerId: string;
  locationId: string;
  isAdmin?: boolean;
}

/** Renders a status badge using the existing design‑system colour palette. */
function StatusBadge({ status }: { status: ProviderOfferingStatus }) {
  switch (status) {
    case ProviderOfferingStatus.Published:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
          <CheckCircle2 className="h-3 w-3" /> Published
        </span>
      );
    case ProviderOfferingStatus.Draft:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-700 rounded-full border border-amber-100">
          <Clock className="h-3 w-3" /> Draft
        </span>
      );
    case ProviderOfferingStatus.Archived:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-500 rounded-full border border-slate-200">
          <Archive className="h-3 w-3" /> Archived
        </span>
      );
  }
}

/**
 * Card component for displaying a single Provider Offering in a grid or list view.
 * Respects the existing ProviderCard design pattern.
 */
export default function ProviderOfferingCard({
  offering,
  providerId,
  locationId,
  isAdmin = false,
}: ProviderOfferingCardProps) {
  const basePath = `/providers/${providerId}/locations/${locationId}/offerings`;
  const displayName = offering.displayNameOverride ?? offering.searchKeywords[0] ?? "Offering";
  const { priceConfiguration: price } = offering;

  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <FlaskConical className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm leading-tight">{displayName}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">{offering.providerBrandName}</p>
            </div>
          </div>
          <StatusBadge status={offering.status} />
        </div>

        {/* Pricing row */}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="inline-flex items-center text-base font-bold text-slate-900">
            <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
            {price.sellingPrice.toLocaleString("en-IN")}
          </span>
          {price.mrp !== price.sellingPrice && (
            <span className="text-xs text-slate-400 line-through">
              ₹{price.mrp.toLocaleString("en-IN")}
            </span>
          )}
          {price.offerPrice !== undefined && (
            <span className="text-[10px] font-semibold bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded-full border border-rose-100">
              Offer: ₹{price.offerPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Capability flags */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-50">
          {offering.availability.onlineBookable && (
            <span className="inline-flex items-center gap-1 text-[10px] text-indigo-600 font-medium">
              <Wifi className="h-3 w-3" /> Online Booking
            </span>
          )}
          {offering.homeCollectionSupported && (
            <span className="inline-flex items-center gap-1 text-[10px] text-teal-600 font-medium">
              <Home className="h-3 w-3" /> Home Collection
            </span>
          )}
          {!offering.availability.enabled && (
            <span className="text-[10px] text-slate-400 italic">Unavailable</span>
          )}
        </div>

        {offering.notes && (
          <p className="text-[11px] text-slate-500 line-clamp-2 pt-1">{offering.notes}</p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2 justify-end">
        {isAdmin && (
          <Link
            href={`${basePath}/${offering.id}/edit`}
            className="px-3 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
          >
            Edit
          </Link>
        )}
        <Link
          href={`${basePath}/${offering.id}`}
          className="px-3 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
