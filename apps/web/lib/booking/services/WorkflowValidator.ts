// lib/booking/services/WorkflowValidator.ts

import { InvalidStatusTransitionError } from "../models/errors";
import { BookingStatus } from "../models/enums";
import { OrderStatus } from "../models/enums";

/**
 * WorkflowValidator centralizes allowed status transitions for Booking and Order.
 * It throws InvalidStatusTransitionError when a transition is not permitted.
 */
export class WorkflowValidator {
  // Define allowed transitions per domain entity
  private bookingTransitions: Record<BookingStatus, BookingStatus[]> = {
    [BookingStatus.Pending]: [BookingStatus.Confirmed, BookingStatus.Cancelled],
    [BookingStatus.Confirmed]: [BookingStatus.Completed, BookingStatus.Cancelled],
    [BookingStatus.Completed]: [], // terminal
    [BookingStatus.Cancelled]: [], // terminal
  };

  private orderTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.Draft]: [OrderStatus.Submitted, OrderStatus.Cancelled],
    [OrderStatus.Submitted]: [OrderStatus.Processed, OrderStatus.Cancelled],
    [OrderStatus.Processed]: [OrderStatus.Cancelled],
    [OrderStatus.Cancelled]: [],
  };

  /** Validate a Booking status transition. */
  assertBookingTransition(current: BookingStatus, next: BookingStatus): void {
    const allowed = this.bookingTransitions[current] ?? [];
    if (!allowed.includes(next)) {
      throw new InvalidStatusTransitionError(current, next);
    }
  }

  /** Validate an Order status transition. */
  assertOrderTransition(current: OrderStatus, next: OrderStatus): void {
    const allowed = this.orderTransitions[current] ?? [];
    if (!allowed.includes(next)) {
      throw new InvalidStatusTransitionError(current, next);
    }
  }

  /** Generic entry point used by services; determines which map to use based on type. */
  assertTransition(current: string, next: string): void {
    // Determine if the statuses belong to Booking or Order by checking enums
    if (Object.values(BookingStatus).includes(current as BookingStatus) && Object.values(BookingStatus).includes(next as BookingStatus)) {
      this.assertBookingTransition(current as BookingStatus, next as BookingStatus);
    } else if (Object.values(OrderStatus).includes(current as OrderStatus) && Object.values(OrderStatus).includes(next as OrderStatus)) {
      this.assertOrderTransition(current as OrderStatus, next as OrderStatus);
    } else {
      // If unknown combination, treat as invalid
      throw new InvalidStatusTransitionError(current, next);
    }
  }
}
