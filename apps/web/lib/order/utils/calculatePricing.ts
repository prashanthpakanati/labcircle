// apps/web/lib/order/utils/calculatePricing.ts

import { OrderItem } from "../models/types";

export interface PricingBreakdown {
  subtotal: number;
  discount: number;
  tax: number;
  homeCollectionFee: number;
  total: number;
}

/**
 * Single source of truth for Order pricing calculations.
 * Encapsulates subtotal summation, discount capping, and future tax/fee fields.
 */
export function calculateOrderPricing(
  items: OrderItem[],
  discount: number = 0,
  homeCollectionFee: number = 0,
  tax: number = 0
): PricingBreakdown {
  const subtotal = items.reduce(
    (sum, item) => sum + (item.priceCharged || 0) * (item.quantity || 1),
    0
  );
  
  // Enforce non-negative values and cap discount to subtotal
  const validDiscount = Math.max(0, discount || 0);
  const effectiveDiscount = Math.min(subtotal, validDiscount);
  const validTax = Math.max(0, tax || 0);
  const validFee = Math.max(0, homeCollectionFee || 0);

  const total = Math.max(0, subtotal - effectiveDiscount + validFee + validTax);

  return {
    subtotal,
    discount: effectiveDiscount,
    tax: validTax,
    homeCollectionFee: validFee,
    total,
  };
}
