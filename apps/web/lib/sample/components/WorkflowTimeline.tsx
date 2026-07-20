// apps/web/lib/sample/components/WorkflowTimeline.tsx

"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SampleStatus } from "../models/enums";
import { SAMPLE_WORKFLOW, getAllowedTransitions } from "../utils/workflow";
import { CheckCircle2, Clock, XCircle, Activity } from "lucide-react";

interface WorkflowTimelineProps {
  currentStatus: SampleStatus;
}

// Ordered steps progression matching SAMPLE_WORKFLOW state sequence
const WORKFLOW_STEPS: { status: SampleStatus; label: string }[] = [
  { status: SampleStatus.PendingCollection, label: "Pending Collection" },
  { status: SampleStatus.Collected, label: "Collected" },
  { status: SampleStatus.ReceivedAtLab, label: "Received At Lab" },
  { status: SampleStatus.Processing, label: "Processing" },
  { status: SampleStatus.Completed, label: "Completed" },
];

export default function WorkflowTimeline({ currentStatus }: WorkflowTimelineProps) {
  const isCancelled = currentStatus === SampleStatus.Cancelled;

  // Use workflow helper to check allowed next states
  const nextAllowedStates = getAllowedTransitions(currentStatus);

  const currentIndex = WORKFLOW_STEPS.findIndex(
    (step) => step.status === currentStatus
  );

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-base font-semibold">Workflow Progression</CardTitle>
          </div>
          {isCancelled ? (
            <span className="text-xs font-semibold text-rose-600 flex items-center gap-1">
              <XCircle className="h-3.5 w-3.5" /> Lifecycle Terminated
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground font-mono">
              Transitions: {Object.keys(SAMPLE_WORKFLOW).length} total stages
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <ol className="relative border-l border-slate-200 ml-3 space-y-6 my-2">
          {WORKFLOW_STEPS.map((step, idx) => {
            let isPassed = false;
            let isCurrent = false;

            if (isCancelled) {
              isPassed = false;
              isCurrent = false;
            } else if (currentIndex !== -1) {
              if (idx < currentIndex) {
                isPassed = true;
              } else if (idx === currentIndex) {
                isCurrent = true;
              }
            }

            const isNextAllowed = nextAllowedStates.includes(step.status);

            return (
              <li key={step.status} className="mb-6 last:mb-0 ml-6">
                <span
                  className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-white ${
                    isPassed
                      ? "bg-emerald-600 text-white"
                      : isCurrent
                      ? "bg-blue-600 text-white animate-pulse"
                      : isCancelled
                      ? "bg-slate-200 text-slate-400"
                      : isNextAllowed
                      ? "bg-amber-100 text-amber-600 border border-amber-300"
                      : "bg-slate-100 text-slate-400 border border-slate-300"
                  }`}
                  aria-label={`${step.label} status indicator`}
                >
                  {isPassed ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : isCurrent ? (
                    <Clock className="w-3.5 h-3.5" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-current" />
                  )}
                </span>

                <div className="flex items-center justify-between">
                  <h4
                    className={`text-xs font-semibold ${
                      isCurrent
                        ? "text-blue-700 text-sm font-bold"
                        : isPassed
                        ? "text-slate-800"
                        : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </h4>
                  {isCurrent && (
                    <span className="text-[10px] font-semibold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      Current Stage
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
