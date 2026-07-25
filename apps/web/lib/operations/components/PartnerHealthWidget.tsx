// apps/web/lib/operations/components/PartnerHealthWidget.tsx

import React from "react";
import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { PartnerHealthScore } from "../models/types";

interface PartnerHealthWidgetProps {
  partnerHealth: PartnerHealthScore[];
}

export default function PartnerHealthWidget({ partnerHealth }: PartnerHealthWidgetProps) {
  if (!partnerHealth || partnerHealth.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs text-muted-foreground text-center">
        No partner processing labs registered in this region.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="h-4 w-4 text-indigo-600" /> Processing Partner Health
        </h4>
        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
          Real-time Reliability
        </span>
      </div>

      <div className="space-y-3">
        {partnerHealth.map((p) => {
          let scoreBadge = "bg-emerald-100 text-emerald-800";
          if (p.reliabilityScore < 85) scoreBadge = "bg-amber-100 text-amber-800";
          if (p.reliabilityScore < 70) scoreBadge = "bg-rose-100 text-rose-800";

          return (
            <div key={p.partnerId} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900">{p.partnerName}</div>
                <div className="text-[10px] text-muted-foreground">
                  Cap: {p.capacityUtilizationPercentage}% | SLA: {p.slaCompliancePercentage}%
                </div>
              </div>

              <div className="flex items-center gap-2">
                {p.qualityTrend === "UPWARD" && <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />}
                {p.qualityTrend === "STABLE" && <Minus className="h-3.5 w-3.5 text-slate-400" />}
                {p.qualityTrend === "DOWNWARD" && <TrendingDown className="h-3.5 w-3.5 text-rose-600" />}

                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${scoreBadge}`}>
                  {p.reliabilityScore}/100
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
