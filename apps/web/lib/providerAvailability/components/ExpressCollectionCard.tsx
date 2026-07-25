// apps/web/lib/providerAvailability/components/ExpressCollectionCard.tsx

"use client";

import React from "react";
import { Zap, Clock, ShieldCheck, ArrowRight } from "lucide-react";

interface ExpressCollectionCardProps {
  isAvailable: boolean;
  pincode: string;
  onSelectExpress: () => void;
  onFallbackToScheduled?: () => void;
}

/**
 * UI Component for ⚡ LabCircle Express (60-Minute Collection).
 * Prominently displayed for Lab Test bookings when express dispatch is available.
 */
export default function ExpressCollectionCard({
  isAvailable,
  pincode,
  onSelectExpress,
  onFallbackToScheduled,
}: ExpressCollectionCardProps) {
  if (!isAvailable) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-slate-500">
          <Zap className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-bold">LabCircle Express Unavailable</span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Express 60-minute collection is currently unavailable for pincode <span className="font-semibold">{pincode}</span>.
        </p>
        {onFallbackToScheduled && (
          <button
            onClick={onFallbackToScheduled}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 underline pt-1 inline-flex items-center gap-1"
          >
            Switch to Scheduled Home Collection <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 text-white rounded-xl p-5 shadow-lg space-y-4 border border-indigo-700/50">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-400 text-indigo-950 rounded-lg shadow-sm font-bold">
            <Zap className="h-5 w-5 fill-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-extrabold tracking-wide flex items-center gap-1.5">
              LabCircle Express
            </h3>
            <p className="text-xs text-amber-300 font-semibold">Collection within 60 Minutes</p>
          </div>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-400/20 text-amber-300 rounded-full border border-amber-400/30 uppercase tracking-wider">
          Premium
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1 text-xs text-indigo-100/90">
        <div className="flex items-center gap-1.5 bg-white/10 p-2 rounded-lg">
          <Clock className="h-4 w-4 text-amber-400 shrink-0" />
          <span>Immediate Dispatch</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/10 p-2 rounded-lg">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Verified Phlebotomist</span>
        </div>
      </div>

      <button
        onClick={onSelectExpress}
        className="w-full py-2.5 px-4 text-xs font-bold text-indigo-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-md flex items-center justify-center gap-1.5"
      >
        Book Express Collection Now <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
