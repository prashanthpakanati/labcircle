// apps/web/lib/commerce/utils/PricingEngine.ts

import { PricingBreakdown } from "../models/types";

export class PricingEngine {
  private static readonly DEFAULT_BASE_TEST_PRICE = 499;
  private static readonly DEFAULT_COLLECTION_FEE = 150;
  private static readonly DEFAULT_EXPRESS_FEE = 250;

  /**
   * Centralized Pricing Engine calculation.
   * Never exposes internal diagnostic partner pricing.
   */
  static calculatePricing(
    serviceCategory: string,
    isHomeCollection: boolean,
    isExpress: boolean,
    membershipDiscountPercent = 0,
    couponDiscountValue = 0,
    isInterStateGst = false
  ): PricingBreakdown {
    const basePrice = serviceCategory === "RADIOLOGY" ? 1200 : this.DEFAULT_BASE_TEST_PRICE;
    const homeCollectionFee = isHomeCollection ? this.DEFAULT_COLLECTION_FEE : 0;
    const expressFee = isExpress ? this.DEFAULT_EXPRESS_FEE : 0;

    const rawSubtotal = basePrice + homeCollectionFee + expressFee;

    const membershipDiscount = Math.round((basePrice * membershipDiscountPercent) / 100);
    const couponDiscount = Math.min(rawSubtotal - membershipDiscount, couponDiscountValue);

    const taxableAmount = Math.max(0, rawSubtotal - membershipDiscount - couponDiscount);

    // GST Calculation: Intra-state (CGST 9% + SGST 9%) vs Inter-state (IGST 18%)
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (isInterStateGst) {
      igst = Math.round(taxableAmount * 0.18);
    } else {
      cgst = Math.round(taxableAmount * 0.09);
      sgst = Math.round(taxableAmount * 0.09);
    }

    const totalPayable = taxableAmount + cgst + sgst + igst;

    return {
      basePrice,
      homeCollectionFee,
      expressFee,
      membershipDiscount,
      couponDiscount,
      taxableAmount,
      cgst,
      sgst,
      igst,
      totalPayable,
    };
  }
}
