// apps/web/lib/operations/components/KPIOverviewWidget.tsx

import React from "react";
import { Activity, Clock, ShieldCheck, Zap } from "lucide-react";
import { KPIMetrics } from "../models/types";

interface KPIOverviewWidgetProps {
  kpis: KPIMetrics;
}

export default function KPIOverviewWidget({ kpis }: KPIOverviewWidgetProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-1">
        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
          <span>Collection Success</span>
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
        </div>
        <div className="text-2xl font-black text-slate-900">{kpis.collectionSuccessRate}%</div>
        <div className="text-[10px] text-emerald-600 font-bold">On-target (99.4% threshold)</div>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-1">
        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
          <span>Avg Dispatch TAT</span>
          <Clock className="h-4 w-4 text-indigo-600" />
        </div>
        <div className="text-2xl font-black text-slate-900">{kpis.avgDispatchTimeMins}m</div>
        <div className="text-[10px] text-indigo-600 font-bold">Target &lt; 15 mins</div>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-1">
        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
          <span>SLA Compliance</span>
          <Activity className="h-4 w-4 text-purple-600" />
        </div>
        <div className="text-2xl font-black text-slate-900">{kpis.slaCompliancePercentage}%</div>
        <div className="text-[10px] text-purple-600 font-bold">Real-time breach monitor</div>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-1">
        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
          <span>Express 60m Success</span>
          <Zap className="h-4 w-4 text-amber-500" />
        </div>
        <div className="text-2xl font-black text-slate-900">{kpis.expressSuccessRate}%</div>
        <div className="text-[10px] text-amber-600 font-bold">Priority doorstep dispatch</div>
      </div>
    </div>
  );
}
