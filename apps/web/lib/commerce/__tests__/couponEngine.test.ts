// apps/web/lib/commerce/__tests__/couponEngine.test.ts

import { describe, it, expect } from "vitest";
import { CouponEngine } from "../utils/CouponEngine";
import { CouponStatus, CouponType } from "../models/enums";
import { Coupon } from "../models/types";
import { Timestamp } from "firebase/firestore";

describe("CouponEngine Rules", () => {
  const activeCoupon: Coupon = {
    code: "WELCOME100",
    discountType: CouponType.FLAT_DISCOUNT,
    discountValue: 100,
    minOrderValue: 400,
    expiryDate: Timestamp.fromDate(new Date(Date.now() + 86400000)),
    maxUses: 100,
    currentUses: 5,
    status: CouponStatus.ACTIVE,
  };

  it("validates active coupon code and returns discount amount", () => {
    const res = CouponEngine.validateCoupon(activeCoupon, 500);
    expect(res.isValid).toBe(true);
    expect(res.discountAmount).toBe(100);
  });

  it("rejects coupon if order value is below minimum requirement", () => {
    const res = CouponEngine.validateCoupon(activeCoupon, 200);
    expect(res.isValid).toBe(false);
    expect(res.reason).toMatch(/Minimum order value/);
  });

  it("rejects expired coupon code", () => {
    const expiredCoupon = {
      ...activeCoupon,
      expiryDate: Timestamp.fromDate(new Date(Date.now() - 86400000)),
    };
    const res = CouponEngine.validateCoupon(expiredCoupon, 500);
    expect(res.isValid).toBe(false);
    expect(res.reason).toMatch(/has expired/);
  });
});
