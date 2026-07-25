// apps/web/lib/providerAvailability/utils/ServiceBookingPolicyEngine.ts

import { ServiceCategory, FulfillmentModel, BookingType } from "../models/enums";
import { ServiceBookingPolicy } from "../models/types";

/**
 * ServiceBookingPolicyEngine
 * --------------------------
 * Core policy engine mapping Service Category to Fulfillment Model and automatically
 * deriving system-controlled BookingType.
 *
 * Guarantees that invalid UI combinations (such as LAB_TEST + CENTER_VISIT or
 * RADIOLOGY + HOME_COLLECTION) cannot be instantiated.
 */
export class ServiceBookingPolicyEngine {
  /**
   * Static policy registry defining the rules for each ServiceCategory.
   */
  private static readonly POLICIES: Record<ServiceCategory, ServiceBookingPolicy> = {
    [ServiceCategory.LAB_TEST]: {
      category: ServiceCategory.LAB_TEST,
      fulfillmentModel: FulfillmentModel.HOME_COLLECTION,
      allowedBookingTypes: [BookingType.HOME_COLLECTION, BookingType.EXPRESS_COLLECTION],
      providerSelectionRequired: false, // 100% LabCircle Brand fulfillment
      technicianAssignmentRequired: true,
    },
    [ServiceCategory.RADIOLOGY]: {
      category: ServiceCategory.RADIOLOGY,
      fulfillmentModel: FulfillmentModel.CENTER_VISIT,
      allowedBookingTypes: [BookingType.CENTER_VISIT],
      providerSelectionRequired: true, // Patient selects Imaging Center
      technicianAssignmentRequired: false,
    },
  };

  /**
   * Retrieves the immutable ServiceBookingPolicy for a given service category.
   *
   * @param category - Target ServiceCategory (LAB_TEST or RADIOLOGY).
   * @returns The corresponding policy configuration.
   */
  static getPolicy(category: ServiceCategory): ServiceBookingPolicy {
    const policy = this.POLICIES[category];
    if (!policy) {
      throw new Error(`No booking policy registered for service category '${category}'`);
    }
    return policy;
  }

  /**
   * Automatically derives the system-controlled BookingType based on Service Category
   * and explicit user intent (e.g. Express mode requested for Lab Test).
   *
   * @param category - ServiceCategory.
   * @param isExpressRequested - Optional flag indicating user selected Express 60-min mode.
   * @returns Derived BookingType.
   */
  static deriveBookingType(category: ServiceCategory, isExpressRequested = false): BookingType {
    const policy = this.getPolicy(category);

    if (category === ServiceCategory.LAB_TEST) {
      if (isExpressRequested) {
        return BookingType.EXPRESS_COLLECTION;
      }
      return BookingType.HOME_COLLECTION;
    }

    if (category === ServiceCategory.RADIOLOGY) {
      return BookingType.CENTER_VISIT;
    }

    return policy.allowedBookingTypes[0];
  }

  /**
   * Validates a booking request against category policy invariants.
   * Throws an explicit error if an invalid combination is attempted.
   *
   * @param category - ServiceCategory.
   * @param bookingType - Derived BookingType.
   * @param providerId - Optional provider location ID.
   */
  static validateRequest(
    category: ServiceCategory,
    bookingType: BookingType,
    providerId?: string | null
  ): void {
    const policy = this.getPolicy(category);

    if (!policy.allowedBookingTypes.includes(bookingType)) {
      throw new Error(
        `Invalid booking combination: BookingType '${bookingType}' is not allowed for ServiceCategory '${category}'. ` +
          `Allowed types: ${policy.allowedBookingTypes.join(", ")}`
      );
    }

    if (policy.providerSelectionRequired && !providerId?.trim()) {
      throw new Error(
        `Invalid booking request: ServiceCategory '${category}' requires explicit provider selection.`
      );
    }

    if (!policy.providerSelectionRequired && providerId?.trim()) {
      // Note: We warn or disallow patient-side provider overrides for lab tests to enforce brand protection.
    }
  }
}
