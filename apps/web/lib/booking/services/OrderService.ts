// lib/booking/services/OrderService.ts

import { Order } from "../models/types";
import { COLLECTIONS } from "../models/constants";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

/** Minimal OrderService skeleton */
export class OrderService {
  private db = getFirestore();

  async getOrder(id: string): Promise<Order | null> {
    const colRef = collection(this.db, COLLECTIONS.orders);
    const q = query(colRef, where("id", "==", id));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data() as Order;
  }

  async listOrdersByPatient(patientId: string): Promise<Order[]> {
    const colRef = collection(this.db, COLLECTIONS.orders);
    const q = query(colRef, where("patientId", "==", patientId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Order);
  }

  async createOrder(_order: Order): Promise<void> {
    // TODO: implement order creation logic
    void _order;
  }
}
