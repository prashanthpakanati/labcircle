// apps/web/lib/commerce/utils/CouponEngine.ts

import { Coupon } from "../models/types";
import { CouponStatus, CouponType } from "../models/enums";

export class CouponEngine {
  /**
   * Validates a coupon code against minimum order requirements, status, and expiry.
   */
  static validateCoupon(
    coupon: Coupon,
    orderValue: number
  ): { isValid: boolean; discountAmount: number; reason?: string } {
    if (coupon.status !== CouponStatus.ACTIVE) {
      return { isValid: false, discountAmount: 0, reason: `Coupon code '${coupon.code}' is not active.` };
    }

    if (coupon.expiryDate.toMillis() < Date.now()) {
      return { isValid: false, discountAmount: 0, reason: `Coupon code '${coupon.code}' has expired.` };
    }

    if (coupon.currentUses >= coupon.maxUses) {
      return { isValid: false, discountAmount: 0, reason: `Coupon code '${coupon.code}' maximum usage limit reached.` };
    }

    if (orderValue < coupon.minOrderValue) {
      return { isValid: false, discountAmount: 0, reason: `Minimum order value of ₹${coupon.minOrderValue} required for this coupon.` };
    }

    let discountAmount = 0;

    if (coupon.discountType === CouponType.FLAT_DISCOUNT) {
      discountAmount = Math.min(orderValue, coupon.discountValue);
    } else if (coupon.discountType === CouponType.PERCENTAGE) {
      discountAmount = Math.round((orderValue * coupon.discountValue) / 100);
    } else if (coupon.discountType === CouponType.FREE_HOME_COLLECTION) {
      discountAmount = 150; // Standard collection fee discount
    }

    return { isValid: true, discountAmount };
  }
}
