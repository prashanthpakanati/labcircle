// apps/web/lib/order/models/form.ts

import { Order, OrderItem } from "./types";
import { PaymentStatus, OrderCollectionType } from "./enums";

export interface OrderFormData {
  patientId: string;
  collectionType: OrderCollectionType;
  items: OrderItem[];
  discount: number;
  notes?: string;
  paymentStatus?: PaymentStatus;
}

/**
 * Mapping utilities between Firestore Order model and OrderFormData.
 */
export const OrderMapper = {
  /** Convert Firestore Order to OrderFormData */
  toOrderForm(order: Order): OrderFormData {
    const { patientId, collectionType, items, discount, notes, paymentStatus } = order;
    return {
      patientId,
      collectionType,
      items,
      discount,
      notes,
      paymentStatus,
    };
  },

  /** Convert OrderFormData (plus optional overrides) to Firestore Order */
  toOrder(form: OrderFormData, overrides?: Partial<Order>): Order {
    return {
      ...overrides,
      ...form,
    } as Order;
  },

  /** Serialize Order for Firestore */
  toFirestore(order: Order): Record<string, unknown> {
    const {
      id,
      displayId,
      patientId,
      status,
      paymentStatus,
      collectionType,
      items,
      subtotal,
      discount,
      total,
      notes,
      createdAt,
      updatedAt,
    } = order;
    return {
      id,
      displayId,
      patientId,
      status,
      paymentStatus,
      collectionType,
      items,
      subtotal,
      discount,
      total,
      notes: notes ?? "",
      createdAt,
      updatedAt,
    };
  },

  /** Construct Order from Firestore data */
  fromFirestore(data: Record<string, unknown>): Order {
    return data as unknown as Order;
  },
};
