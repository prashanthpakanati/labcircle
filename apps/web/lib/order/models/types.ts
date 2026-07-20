// apps/web/lib/order/models/types.ts

import { OrderStatus, PaymentStatus, OrderCollectionType } from "./enums";

export interface OrderItem {
  testId: string;
  testName: string;
  testCode: string;
  priceCharged: number;
  quantity: number;
}

export interface PricingSummary {
  subtotal: number;
  discount: number;
  total: number;
}

export interface Order {
  id: string;
  displayId: string; // e.g. ORD000001
  patientId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  collectionType: OrderCollectionType;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  notes?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
