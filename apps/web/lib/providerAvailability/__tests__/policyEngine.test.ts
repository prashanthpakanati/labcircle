// apps/web/lib/providerAvailability/__tests__/policyEngine.test.ts

import { describe, it, expect } from "vitest";
import { ServiceBookingPolicyEngine } from "../utils/ServiceBookingPolicyEngine";
import { ServiceCategory, FulfillmentModel, BookingType } from "../models/enums";

describe("ServiceBookingPolicyEngine", () => {
  it("maps LAB_TEST to HOME_COLLECTION fulfillment model", () => {
    const policy = ServiceBookingPolicyEngine.getPolicy(ServiceCategory.LAB_TEST);
    expect(policy.fulfillmentModel).toBe(FulfillmentModel.HOME_COLLECTION);
    expect(policy.allowedBookingTypes).toContain(BookingType.HOME_COLLECTION);
    expect(policy.allowedBookingTypes).toContain(BookingType.EXPRESS_COLLECTION);
    expect(policy.allowedBookingTypes).not.toContain(BookingType.CENTER_VISIT);
    expect(policy.providerSelectionRequired).toBe(false);
    expect(policy.technicianAssignmentRequired).toBe(true);
  });

  it("maps RADIOLOGY to CENTER_VISIT fulfillment model", () => {
    const policy = ServiceBookingPolicyEngine.getPolicy(ServiceCategory.RADIOLOGY);
    expect(policy.fulfillmentModel).toBe(FulfillmentModel.CENTER_VISIT);
    expect(policy.allowedBookingTypes).toEqual([BookingType.CENTER_VISIT]);
    expect(policy.providerSelectionRequired).toBe(true);
    expect(policy.technicianAssignmentRequired).toBe(false);
  });

  it("system-derives BookingType for LAB_TEST standard and express modes", () => {
    expect(ServiceBookingPolicyEngine.deriveBookingType(ServiceCategory.LAB_TEST, false)).toBe(
      BookingType.HOME_COLLECTION
    );
    expect(ServiceBookingPolicyEngine.deriveBookingType(ServiceCategory.LAB_TEST, true)).toBe(
      BookingType.EXPRESS_COLLECTION
    );
  });

  it("system-derives BookingType for RADIOLOGY as CENTER_VISIT", () => {
    expect(ServiceBookingPolicyEngine.deriveBookingType(ServiceCategory.RADIOLOGY)).toBe(
      BookingType.CENTER_VISIT
    );
  });

  it("rejects invalid request combination (LAB_TEST + CENTER_VISIT)", () => {
    expect(() =>
      ServiceBookingPolicyEngine.validateRequest(
        ServiceCategory.LAB_TEST,
        BookingType.CENTER_VISIT
      )
    ).toThrow("Invalid booking combination");
  });

  it("rejects invalid request combination (RADIOLOGY + HOME_COLLECTION)", () => {
    expect(() =>
      ServiceBookingPolicyEngine.validateRequest(
        ServiceCategory.RADIOLOGY,
        BookingType.HOME_COLLECTION,
        "provider-loc-1"
      )
    ).toThrow("Invalid booking combination");
  });

  it("rejects RADIOLOGY request without provider location ID", () => {
    expect(() =>
      ServiceBookingPolicyEngine.validateRequest(
        ServiceCategory.RADIOLOGY,
        BookingType.CENTER_VISIT,
        ""
      )
    ).toThrow("requires explicit provider selection");
  });
});
