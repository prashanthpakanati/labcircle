// apps/web/lib/fulfillment/__tests__/stateMachine.test.ts

import { describe, it, expect } from "vitest";
import { FulfillmentStateMachine } from "../utils/FulfillmentStateMachine";
import { FulfillmentStatus } from "../models/enums";

describe("FulfillmentStateMachine", () => {
  it("allows valid state machine sequence", () => {
    expect(
      FulfillmentStateMachine.canTransition(
        FulfillmentStatus.BOOKED,
        FulfillmentStatus.FULFILLMENT_CREATED
      )
    ).toBe(true);

    expect(
      FulfillmentStateMachine.canTransition(
        FulfillmentStatus.FULFILLMENT_CREATED,
        FulfillmentStatus.TECHNICIAN_ASSIGNED
      )
    ).toBe(true);

    expect(
      FulfillmentStateMachine.canTransition(
        FulfillmentStatus.ARRIVED,
        FulfillmentStatus.OTP_VERIFIED
      )
    ).toBe(true);

    expect(
      FulfillmentStateMachine.canTransition(
        FulfillmentStatus.OTP_VERIFIED,
        FulfillmentStatus.SAMPLE_COLLECTED
      )
    ).toBe(true);
  });

  it("rejects illegal state jumps (BOOKED -> SAMPLE_COLLECTED)", () => {
    expect(
      FulfillmentStateMachine.canTransition(
        FulfillmentStatus.BOOKED,
        FulfillmentStatus.SAMPLE_COLLECTED
      )
    ).toBe(false);

    expect(() =>
      FulfillmentStateMachine.validateTransition(
        FulfillmentStatus.BOOKED,
        FulfillmentStatus.SAMPLE_COLLECTED
      )
    ).toThrow("Invalid Fulfillment State Machine transition");
  });

  it("allows transition to terminal CANCELLED state from active state", () => {
    expect(
      FulfillmentStateMachine.canTransition(
        FulfillmentStatus.TECHNICIAN_EN_ROUTE,
        FulfillmentStatus.CANCELLED
      )
    ).toBe(true);
  });

  it("disallows transition out of terminal COMPLETED state", () => {
    expect(
      FulfillmentStateMachine.canTransition(
        FulfillmentStatus.COMPLETED,
        FulfillmentStatus.PROCESSING
      )
    ).toBe(false);
  });
});
