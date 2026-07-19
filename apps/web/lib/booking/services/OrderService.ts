// lib/booking/services/OrderService.ts

import { Order } from "../models/types";
import { OrderStatus } from "../models/enums";
import { COLLECTIONS } from "../models/constants";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  getDocs,
  Timestamp,
  runTransaction,
  UpdateData,
} from "firebase/firestore";
import { OrderNotFoundError, ValidationError } from "../models/errors";
import { WorkflowValidator } from "./WorkflowValidator";

/**
 * OrderService implements the lifecycle of an order.
 * Provides creation, retrieval, listing and status management.
 */
export class OrderService {
  private db = getFirestore();
  private validator = new WorkflowValidator();

  /** Create a new order. */
  async createOrder(data: { patientId: string; testIds?: string[] }): Promise<Order> {
    if (!data.patientId) throw new ValidationError("patientId is required");
    const orderRef = doc(collection(this.db, COLLECTIONS.orders));
    const now = Timestamp.now();
    const order: Order = {
      id: orderRef.id,
      patientId: data.patientId,
      status: OrderStatus.Draft,
      createdAt: now.toDate().toISOString(),
      updatedAt: now.toDate().toISOString(),
      testIds: data.testIds ?? [],
    };
    await setDoc(orderRef, order);
    return order;
  }

  /** Retrieve a single order by ID. */
  async getOrder(id: string): Promise<Order> {
    const snap = await getDoc(doc(this.db, COLLECTIONS.orders, id));
    if (!snap.exists()) throw new OrderNotFoundError(id);
    return snap.data() as Order;
  }

  /** List all orders for a patient. */
  async listOrdersByPatient(patientId: string): Promise<Order[]> {
    const colRef = collection(this.db, COLLECTIONS.orders);
    const q = query(colRef, where("patientId", "==", patientId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Order);
  }

  /** Internal status update with transition validation. */
  private async updateStatusInternal(id: string, newStatus: OrderStatus): Promise<void> {
    const orderRef = doc(this.db, COLLECTIONS.orders, id);
    await runTransaction(this.db, async (tx) => {
      const snap = await tx.get(orderRef);
      if (!snap.exists()) throw new OrderNotFoundError(id);
      const order = snap.data() as Order;
      this.validator.assertTransition(order.status, newStatus);
      const upd: UpdateData<any> = { status: newStatus, updatedAt: Timestamp.now() };
      tx.update(orderRef, upd);
    });
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
    await this.updateStatusInternal(id, status);
  }

  async cancelOrder(id: string): Promise<void> {
    await this.updateStatusInternal(id, OrderStatus.Cancelled);
  }
}
