// apps/web/lib/sample/components/SampleStatusActions.tsx

"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { SampleStatus } from "../models/enums";
import { getAllowedTransitions } from "../utils/workflow";
import { useUpdateSampleStatus } from "../hooks/useUpdateSampleStatus";
import {
  Syringe,
  Building2,
  Play,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface SampleStatusActionsProps {
  sampleId: string;
  currentStatus: SampleStatus;
  onStatusUpdated: () => void;
}

export default function SampleStatusActions({
  sampleId,
  currentStatus,
  onStatusUpdated,
}: SampleStatusActionsProps) {
  const { updateStatus, loading, error } = useUpdateSampleStatus();

  // Dialog state
  const [pendingTargetStatus, setPendingTargetStatus] = useState<SampleStatus | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const allowedTransitions = getAllowedTransitions(currentStatus);

  if (allowedTransitions.length === 0) {
    return null;
  }

  const handleActionClick = (
    targetStatus: SampleStatus,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    triggerRef.current = event.currentTarget;

    // Require confirmation dialog for Complete and Cancel transitions
    if (
      targetStatus === SampleStatus.Completed ||
      targetStatus === SampleStatus.Cancelled
    ) {
      setPendingTargetStatus(targetStatus);
    } else {
      executeStatusUpdate(targetStatus);
    }
  };

  const executeStatusUpdate = async (targetStatus: SampleStatus) => {
    const success = await updateStatus(sampleId, targetStatus);
    if (success) {
      setPendingTargetStatus(null);
      onStatusUpdated();
    }
    // Return focus to trigger button if dialog was open
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  };

  const closeDialog = () => {
    setPendingTargetStatus(null);
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {error && (
        <div className="flex items-center gap-2 text-destructive text-xs font-medium bg-destructive/10 p-2.5 rounded-md border border-destructive/20 mb-1">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error.message || "Failed to update sample status."}</span>
        </div>
      )}

      {/* Action Buttons: Responsive stacked on mobile, row on desktop */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {allowedTransitions.map((targetStatus) => {
          if (targetStatus === SampleStatus.Collected) {
            return (
              <Button
                key={targetStatus}
                onClick={(e) => handleActionClick(targetStatus, e)}
                disabled={loading}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5 h-8"
                aria-label="Mark sample as collected"
              >
                {loading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Syringe className="h-3.5 w-3.5" />
                )}
                Mark Collected
              </Button>
            );
          }

          if (targetStatus === SampleStatus.ReceivedAtLab) {
            return (
              <Button
                key={targetStatus}
                onClick={(e) => handleActionClick(targetStatus, e)}
                disabled={loading}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold gap-1.5 h-8"
                aria-label="Mark sample as received at lab"
              >
                {loading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Building2 className="h-3.5 w-3.5" />
                )}
                Receive At Lab
              </Button>
            );
          }

          if (targetStatus === SampleStatus.Processing) {
            return (
              <Button
                key={targetStatus}
                onClick={(e) => handleActionClick(targetStatus, e)}
                disabled={loading}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold gap-1.5 h-8"
                aria-label="Start processing sample"
              >
                {loading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
                Start Processing
              </Button>
            );
          }

          if (targetStatus === SampleStatus.Completed) {
            return (
              <Button
                key={targetStatus}
                onClick={(e) => handleActionClick(targetStatus, e)}
                disabled={loading}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold gap-1.5 h-8"
                aria-label="Mark sample as complete"
              >
                {loading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                )}
                Complete Sample
              </Button>
            );
          }

          if (targetStatus === SampleStatus.Cancelled) {
            return (
              <Button
                key={targetStatus}
                variant="outline"
                onClick={(e) => handleActionClick(targetStatus, e)}
                disabled={loading}
                size="sm"
                className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800 text-xs font-semibold gap-1.5 h-8"
                aria-label="Cancel sample collection"
              >
                {loading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <XCircle className="h-3.5 w-3.5" />
                )}
                Cancel Sample
              </Button>
            );
          }

          return null;
        })}
      </div>

      {/* Confirmation Dialog */}
      <Dialog isOpen={pendingTargetStatus !== null} onClose={closeDialog}>
        <DialogHeader>
          <DialogTitle>
            {pendingTargetStatus === SampleStatus.Completed
              ? "Confirm Sample Completion"
              : "Confirm Sample Cancellation"}
          </DialogTitle>
          <DialogDescription>
            {pendingTargetStatus === SampleStatus.Completed
              ? "Are you sure you want to mark this sample as Completed? This action will finalize sample processing."
              : "Are you sure you want to cancel this sample collection? This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            size="sm"
            onClick={closeDialog}
            disabled={loading}
            className="text-xs"
          >
            Go Back
          </Button>

          {pendingTargetStatus === SampleStatus.Completed && (
            <Button
              onClick={() => executeStatusUpdate(SampleStatus.Completed)}
              disabled={loading}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Completing...
                </>
              ) : (
                "Complete Sample"
              )}
            </Button>
          )}

          {pendingTargetStatus === SampleStatus.Cancelled && (
            <Button
              onClick={() => executeStatusUpdate(SampleStatus.Cancelled)}
              disabled={loading}
              size="sm"
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Cancelling...
                </>
              ) : (
                "Cancel Sample"
              )}
            </Button>
          )}
        </DialogFooter>
      </Dialog>
    </div>
  );
}
