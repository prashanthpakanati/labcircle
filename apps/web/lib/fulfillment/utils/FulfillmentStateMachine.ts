// apps/web/lib/fulfillment/utils/FulfillmentStateMachine.ts

import { FulfillmentStatus } from "../models/enums";

/**
 * FulfillmentStateMachine
 * -----------------------
 * Encapsulates valid state machine transitions for the fulfillment lifecycle.
 * Rejects illegal state jumps with descriptive error messages.
 */
export class FulfillmentStateMachine {
  /**
   * Transition matrix defining allowed next statuses for every state.
   */
  private static readonly ALLOWED_TRANSITIONS: Record<FulfillmentStatus, FulfillmentStatus[]> = {
    [FulfillmentStatus.BOOKED]: [
      FulfillmentStatus.FULFILLMENT_CREATED,
      FulfillmentStatus.CANCELLED,
    ],
    [FulfillmentStatus.FULFILLMENT_CREATED]: [
      FulfillmentStatus.TECHNICIAN_ASSIGNED,
      FulfillmentStatus.CANCELLED,
      FulfillmentStatus.RESCHEDULED,
    ],
    [FulfillmentStatus.TECHNICIAN_ASSIGNED]: [
      FulfillmentStatus.TECHNICIAN_ACCEPTED,
      FulfillmentStatus.TECHNICIAN_ASSIGNED, // Re-assignment
      FulfillmentStatus.CANCELLED,
      FulfillmentStatus.RESCHEDULED,
    ],
    [FulfillmentStatus.TECHNICIAN_ACCEPTED]: [
      FulfillmentStatus.TECHNICIAN_EN_ROUTE,
      FulfillmentStatus.CANCELLED,
      FulfillmentStatus.RESCHEDULED,
    ],
    [FulfillmentStatus.TECHNICIAN_EN_ROUTE]: [
      FulfillmentStatus.ARRIVED,
      FulfillmentStatus.CANCELLED,
      FulfillmentStatus.NO_SHOW,
    ],
    [FulfillmentStatus.ARRIVED]: [
      FulfillmentStatus.OTP_VERIFIED,
      FulfillmentStatus.NO_SHOW,
      FulfillmentStatus.CANCELLED,
    ],
    [FulfillmentStatus.OTP_VERIFIED]: [
      FulfillmentStatus.SAMPLE_COLLECTED,
      FulfillmentStatus.FAILED,
    ],
    [FulfillmentStatus.SAMPLE_COLLECTED]: [
      FulfillmentStatus.SAMPLE_PACKED,
      FulfillmentStatus.FAILED,
    ],
    [FulfillmentStatus.SAMPLE_PACKED]: [
      FulfillmentStatus.IN_TRANSIT_TO_LAB,
      FulfillmentStatus.FAILED,
    ],
    [FulfillmentStatus.IN_TRANSIT_TO_LAB]: [
      FulfillmentStatus.LAB_RECEIVED,
      FulfillmentStatus.FAILED,
    ],
    [FulfillmentStatus.LAB_RECEIVED]: [
      FulfillmentStatus.PROCESSING,
      FulfillmentStatus.FAILED,
    ],
    [FulfillmentStatus.PROCESSING]: [
      FulfillmentStatus.REPORT_READY,
      FulfillmentStatus.FAILED,
    ],
    [FulfillmentStatus.REPORT_READY]: [
      FulfillmentStatus.COMPLETED,
    ],
    // Terminal States (No further forward transitions allowed)
    [FulfillmentStatus.COMPLETED]: [],
    [FulfillmentStatus.CANCELLED]: [],
    [FulfillmentStatus.FAILED]: [],
    [FulfillmentStatus.NO_SHOW]: [],
    [FulfillmentStatus.RESCHEDULED]: [],
  };

  /**
   * Checks whether a status transition is permitted.
   */
  static canTransition(current: FulfillmentStatus, next: FulfillmentStatus): boolean {
    const allowed = this.ALLOWED_TRANSITIONS[current];
    return allowed ? allowed.includes(next) : false;
  }

  /**
   * Asserts that a transition is valid. Throws an explicit error if rejected.
   */
  static validateTransition(current: FulfillmentStatus, next: FulfillmentStatus): void {
    if (!this.canTransition(current, next)) {
      throw new Error(
        `Invalid Fulfillment State Machine transition: Cannot transition from '${current}' to '${next}'.`
      );
    }
  }
}
