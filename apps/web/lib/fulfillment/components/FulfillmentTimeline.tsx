// apps/web/lib/fulfillment/components/FulfillmentTimeline.tsx

import React from "react";
import { CheckCircle2, Clock, MapPin, User } from "lucide-react";
import { FulfillmentTimelineEvent } from "../models/types";
import { TimelineEventType } from "../models/enums";

interface FulfillmentTimelineProps {
  events: FulfillmentTimelineEvent[];
}

/**
 * Renders immutable chronological step progression and timeline audit logs.
 */
export default function FulfillmentTimeline({ events }: FulfillmentTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center text-xs text-muted-foreground">
        No operational timeline events recorded yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
        <Clock className="h-4 w-4 text-indigo-600" /> Operational Audit Timeline
      </h4>

      <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pl-4">
        {events.map((evt, idx) => {
          let eventBadgeColor = "bg-slate-100 text-slate-700";
          if (evt.eventType === TimelineEventType.OPERATIONAL) eventBadgeColor = "bg-indigo-100 text-indigo-700";
          if (evt.eventType === TimelineEventType.LABORATORY) eventBadgeColor = "bg-purple-100 text-purple-700";
          if (evt.eventType === TimelineEventType.AUDIT) eventBadgeColor = "bg-amber-100 text-amber-700";

          return (
            <div key={evt.id || idx} className="relative group">
              {/* Dot marker */}
              <div className="absolute -left-[23px] top-0.5 bg-white rounded-full p-0.5 border border-slate-300">
                <CheckCircle2 className="h-4 w-4 text-indigo-600" />
              </div>

              <div className="bg-white border border-slate-100 rounded-xl p-3.5 shadow-sm space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    {evt.currentStatus.replace(/_/g, " ")}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${eventBadgeColor}`}>
                    {evt.eventType}
                  </span>
                </div>

                {evt.notes && <p className="text-xs text-slate-600 font-medium mt-1">{evt.notes}</p>}

                <div className="flex items-center gap-3 text-[10px] text-muted-foreground pt-1 border-t border-slate-50">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3 text-slate-400" /> {evt.performedByRole} ({evt.performedBy})
                  </span>
                  {evt.location && (
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="h-3 w-3 text-slate-400" /> {evt.location.latitude.toFixed(4)}, {evt.location.longitude.toFixed(4)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
