// apps/web/lib/sample/utils/createSampleItemsFromOrder.ts

import { Order } from "../../order/models/types";
import { SampleItem } from "../models/types";

/**
 * Pure utility function that creates SampleItems from an Order's immutable OrderItem snapshots.
 * Does not fetch from the Test Catalog or modify pricing/names.
 *
 * @param order - The source Order object containing order items.
 * @returns An array of SampleItem objects ready for sample creation.
 */
export function createSampleItemsFromOrder(order: Order): SampleItem[] {
  if (!order || !Array.isArray(order.items)) {
    return [];
  }

  return order.items.map((item) => ({
    testId: item.testId,
    testName: item.testName,
    testCode: item.testCode,
    sampleType: "Whole Blood",
    containerType: "EDTA Tube",
  }));
}
