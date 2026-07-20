// apps/web/lib/sample/utils/workflow.ts

import { SampleStatus } from "../models/enums";

/**
 * Centralized workflow engine definition for Sample status transitions.
 * Serves as the single source of truth across web UI, mobile, and service layers.
 */
export const SAMPLE_WORKFLOW: Record<SampleStatus, SampleStatus[]> = {
  [SampleStatus.PendingCollection]: [SampleStatus.Collected, SampleStatus.Cancelled],
  [SampleStatus.Collected]: [SampleStatus.ReceivedAtLab, SampleStatus.Cancelled],
  [SampleStatus.ReceivedAtLab]: [SampleStatus.Processing, SampleStatus.Cancelled],
  [SampleStatus.Processing]: [SampleStatus.Completed, SampleStatus.Cancelled],
  [SampleStatus.Completed]: [],
  [SampleStatus.Cancelled]: [],
};

/**
 * Returns the array of allowed status transitions from a given current status.
 */
export function getAllowedTransitions(status: SampleStatus): SampleStatus[] {
  return SAMPLE_WORKFLOW[status] ?? [];
}

/**
 * Checks whether transitioning from `from` status to `to` status is permitted.
 */
export function canTransition(from: SampleStatus, to: SampleStatus): boolean {
  return getAllowedTransitions(from).includes(to);
}
