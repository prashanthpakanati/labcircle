// apps/web/lib/analytics/components/KPICard.tsx

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { KPISnapshot } from "../models/types";
import { TrendDirection } from "../models/enums";

interface KPICardProps {
  kpi: KPISnapshot;
}

export default function KPICard({ kpi }: KPICardProps) {
  let trendIcon = <Minus className="h-4 w-4 text-slate-400" />;
  if (kpi.trend === TrendDirection.UPWARD) trendIcon = <TrendingUp className="h-4 w-4 text-emerald-600" />;
  if (kpi.trend === TrendDirection.DOWNWARD) trendIcon = <TrendingDown className="h-4 w-4 text-rose-600" />;

  const isPositiveVariance = kpi.variancePercent >= 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3 max-w-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{kpi.name}</span>
        {trendIcon}
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-black text-slate-900">
          {kpi.unit === "₹" ? `₹${kpi.actualValue.toLocaleString()}` : `${kpi.actualValue} ${kpi.unit}`}
        </span>
        <span className={`text-xs font-bold ${isPositiveVariance ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"} px-2 py-0.5 rounded-full`}>
          {isPositiveVariance ? "+" : ""}{kpi.variancePercent}% vs Target
        </span>
      </div>

      <div className="text-[11px] text-slate-500">
        Target: <span className="font-semibold text-slate-700">{kpi.unit === "₹" ? `₹${kpi.targetValue.toLocaleString()}` : `${kpi.targetValue} ${kpi.unit}`}</span>
      </div>
    </div>
  );
}
