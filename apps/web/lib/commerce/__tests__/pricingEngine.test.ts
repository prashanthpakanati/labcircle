// apps/web/lib/commerce/__tests__/pricingEngine.test.ts

import { describe, it, expect } from "vitest";
import { PricingEngine } from "../utils/PricingEngine";

describe("PricingEngine", () => {
  it("calculates standard base pricing with home collection fee", () => {
    const res = PricingEngine.calculatePricing("LAB_TEST", true, false);

    expect(res.basePrice).toBe(499);
    expect(res.homeCollectionFee).toBe(150);
    expect(res.expressFee).toBe(0);
    expect(res.taxableAmount).toBe(649);
    expect(res.cgst).toBe(58); // 9% of 649 = 58.41
    expect(res.sgst).toBe(58);
    expect(res.totalPayable).toBe(765); // 649 + 116 = 765
  });

  it("applies express surcharge and membership discount correctly", () => {
    const res = PricingEngine.calculatePricing("LAB_TEST", true, true, 20); // 20% membership discount on base

    expect(res.expressFee).toBe(250);
    expect(res.membershipDiscount).toBe(100); // 20% of 499 = 99.8 -> 100
    expect(res.taxableAmount).toBe(799); // (499 + 150 + 250) - 100 = 799
  });

  it("calculates IGST for inter-state tax rule", () => {
    const res = PricingEngine.calculatePricing("LAB_TEST", false, false, 0, 0, true);

    expect(res.cgst).toBe(0);
    expect(res.sgst).toBe(0);
    expect(res.igst).toBe(90); // 18% of 499 = 89.82 -> 90
  });
});
