// apps/web/lib/commerce/models/types.ts

import { Timestamp } from "firebase/firestore";
import {
  MembershipStatus,
  SubscriptionStatus,
  PaymentStatus,
  PaymentMethodType,
  WalletType,
  WalletTransactionType,
  CouponType,
  CouponStatus,
  InvoiceStatus,
  RefundStatus,
  RewardType,
  PricingStrategy,
  TaxType,
} from "./enums";

export interface PricingRule {
  id: string;
  serviceCategory: string;
  basePrice: number;
  homeCollectionFee: number;
  expressFee: number;
  region: string;
  strategy: PricingStrategy;
  isActive: boolean;
}

export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  annualPrice: number;
  discountPercentage: number;
  freeCollectionsCount: number;
  isActive: boolean;
}

export interface Membership {
  id: string;
  patientId: string;
  planId: string;
  status: MembershipStatus;
  startDate: Timestamp;
  endDate: Timestamp;
  autoRenew: boolean;
  freeCollectionsRemaining: number;
}

export interface Subscription {
  id: string;
  patientId: string;
  planId: string;
  status: SubscriptionStatus;
  billingPeriod: "MONTHLY" | "QUARTERLY" | "ANNUAL";
  amount: number;
  nextBillingDate: Timestamp;
}

export interface PaymentTransaction {
  id: string;
  bookingId: string;
  patientId: string;
  gateway: "RAZORPAY" | "PHONEPE" | "STRIPE" | "MOCK";
  gatewayTxnId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethodType;
  status: PaymentStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Wallet {
  patientId: string;
  type: WalletType;
  balance: number;
  promotionalBalance: number;
  currency: string;
  updatedAt: Timestamp;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: WalletTransactionType;
  amount: number;
  balanceAfter: number;
  referenceId: string;
  notes: string;
  createdAt: Timestamp;
}

export interface Coupon {
  code: string;
  discountType: CouponType;
  discountValue: number;
  minOrderValue: number;
  expiryDate: Timestamp;
  maxUses: number;
  currentUses: number;
  status: CouponStatus;
}

export interface CouponRedemption {
  id: string;
  couponCode: string;
  patientId: string;
  bookingId: string;
  discountAmount: number;
  redeemedAt: Timestamp;
}

export interface InvoiceItem {
  description: string;
  hsnSacCode: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxableAmount: number;
  gstAmount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  bookingId: string;
  patientId: string;
  patientName: string;
  items: InvoiceItem[];
  subtotal: number;
  discountTotal: number;
  taxableTotal: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  issuedAt: Timestamp;
}

export interface TaxRule {
  id: string;
  taxType: TaxType;
  cgstRate: number; // e.g. 9%
  sgstRate: number; // e.g. 9%
  igstRate: number; // e.g. 18%
  isActive: boolean;
}

export interface Refund {
  id: string;
  paymentTransactionId: string;
  bookingId: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  refundMethod: "WALLET" | "GATEWAY";
  processedAt?: Timestamp | null;
  createdAt: Timestamp;
}

export interface RewardTransaction {
  id: string;
  referrerId: string;
  referredId: string;
  rewardType: RewardType;
  amount: number;
  status: string;
  createdAt: Timestamp;
}

export interface CorporateAccount {
  id: string;
  companyName: string;
  gstin: string;
  creditLimit: number;
  currentBalance: number;
  paymentTermsDays: number;
  isActive: boolean;
}

export interface CommerceAuditRecord {
  id: string;
  action: string;
  actorId: string;
  actorRole: string;
  targetEntity: string;
  targetEntityId: string;
  changes: Record<string, unknown>;
  timestamp: Timestamp;
}

export interface PricingBreakdown {
  basePrice: number;
  homeCollectionFee: number;
  expressFee: number;
  membershipDiscount: number;
  couponDiscount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalPayable: number;
}
