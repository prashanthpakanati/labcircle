// apps/web/lib/operations/components/ActiveAlertsWidget.tsx

import React from "react";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { OperationalAlert } from "../models/types";
import { AlertSeverity } from "../models/enums";

interface ActiveAlertsWidgetProps {
  alerts: OperationalAlert[];
}

export default function ActiveAlertsWidget({ alerts }: ActiveAlertsWidgetProps) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
        <Info className="h-4 w-4 text-emerald-600" /> All operational metrics and SLA thresholds are operating normally in this region.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Active Command Alerts</h4>
      <div className="space-y-2">
        {alerts.map((a) => {
          let style = "bg-slate-50 text-slate-800 border-slate-200";
          let icon = <Info className="h-4 w-4 text-slate-500" />;

          if (a.severity === AlertSeverity.CRITICAL) {
            style = "bg-rose-50 text-rose-900 border-rose-200";
            icon = <AlertCircle className="h-4 w-4 text-rose-600" />;
          } else if (a.severity === AlertSeverity.WARNING) {
            style = "bg-amber-50 text-amber-900 border-amber-200";
            icon = <AlertTriangle className="h-4 w-4 text-amber-600" />;
          }

          return (
            <div key={a.id} className={`border rounded-xl p-3.5 flex items-start gap-3 ${style}`}>
              <div className="mt-0.5">{icon}</div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold">{a.title}</div>
                <div className="text-xs">{a.message}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
