// apps/web/lib/commerce/models/form.ts

import { PaymentMethodType } from "./enums";

export interface CalculatePricingFormData {
  serviceCategory: string;
  isHomeCollection: boolean;
  isExpress: boolean;
  region: string;
  membershipId?: string;
  couponCode?: string;
}

export interface ProcessPaymentFormData {
  bookingId: string;
  patientId: string;
  amount: number;
  paymentMethod: PaymentMethodType;
  gateway?: "RAZORPAY" | "PHONEPE" | "STRIPE" | "MOCK";
}

export interface WalletTopupFormData {
  patientId: string;
  amount: number;
  notes: string;
}

export interface ApplyCouponFormData {
  code: string;
  patientId: string;
  orderValue: number;
}

export interface RequestRefundFormData {
  paymentTransactionId: string;
  bookingId: string;
  amount: number;
  reason: string;
  refundMethod: "WALLET" | "GATEWAY";
}
