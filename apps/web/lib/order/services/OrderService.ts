// apps/web/lib/order/services/OrderService.ts

import { getFirestore, collection, doc, setDoc, getDoc, getDocs, Timestamp, runTransaction } from "firebase/firestore";
import { ORDER_COLLECTION } from "../models/constants";
import { Order } from "../models/types";
import { OrderStatus, PaymentStatus } from "../models/enums";
import { OrderFormData } from "../models/form";
import { calculateOrderPricing } from "../utils/calculatePricing";

/**
 * OrderService implements CRUD operations for the Order domain.
 * Follows the exact architecture and patterns established in Patient and Test services.
 */
export class OrderService {
  private db = getFirestore();

  /** Create a new order and generate a sequential displayId (ORD000001). */
  async createOrder(form: OrderFormData): Promise<Order> {
    const orderRef = doc(collection(this.db, ORDER_COLLECTION));
    const counterRef = doc(this.db, "counters", "orders");

    // Transaction to atomically increment counter and obtain the new displayId.
    const newCount = await runTransaction(this.db, async (tx) => {
      const snap = await tx.get(counterRef);
      const current = snap.exists() ? (snap.data() as { value: number }).value : 0;
      const next = current + 1;
      tx.set(counterRef, { value: next });
      return next;
    });

    const displayId = `ORD${String(newCount).padStart(6, "0")}`;
    const now = Timestamp.now();

    // Centralized financial calculations
    const pricing = calculateOrderPricing(form.items, form.discount);

    const order: Order = {
      id: orderRef.id,
      displayId,
      patientId: form.patientId,
      status: OrderStatus.Pending,
      paymentStatus: form.paymentStatus ?? PaymentStatus.Unpaid,
      collectionType: form.collectionType,
      items: form.items,
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      total: pricing.total,
      notes: form.notes ?? "",
      createdAt: now.toDate().toISOString(),
      updatedAt: now.toDate().toISOString(),
    };

    await setDoc(orderRef, order);
    return order;
  }

  /** Retrieve an order by Firestore document ID. */
  async getOrder(id: string): Promise<Order> {
    const snap = await getDoc(doc(this.db, ORDER_COLLECTION, id));
    if (!snap.exists()) throw new Error(`Order ${id} not found`);
    return snap.data() as Order;
  }

  /** List all orders. */
  async listOrders(): Promise<Order[]> {
    const colRef = collection(this.db, ORDER_COLLECTION);
    const snap = await getDocs(colRef);
    return snap.docs.map((d) => d.data() as Order);
  }

  /** Update mutable fields of an order. */
  async updateOrder(
    id: string,
    updates: Partial<OrderFormData> & { status?: OrderStatus; paymentStatus?: PaymentStatus }
  ): Promise<void> {
    const orderRef = doc(this.db, ORDER_COLLECTION, id);
    
    // Recalculate totals if items or discount are updated
    let financialUpdates: Partial<Order> = {};
    if (updates.items || updates.discount !== undefined) {
      const existing = await this.getOrder(id);
      const items = updates.items ?? existing.items;
      const discount = updates.discount !== undefined ? updates.discount : existing.discount;
      const pricing = calculateOrderPricing(items, discount);
      financialUpdates = {
        subtotal: pricing.subtotal,
        discount: pricing.discount,
        total: pricing.total,
      };
    }

    const upd = {
      ...updates,
      ...financialUpdates,
      updatedAt: Timestamp.now().toDate().toISOString(),
    };
    await setDoc(orderRef, upd, { merge: true });
  }

  /** Cancel an order (set status to Cancelled). */
  async cancelOrder(id: string): Promise<void> {
    await this.updateOrder(id, { status: OrderStatus.Cancelled });
  }
}
