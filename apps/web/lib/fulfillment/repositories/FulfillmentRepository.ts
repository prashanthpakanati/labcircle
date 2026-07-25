// apps/web/lib/fulfillment/repositories/FulfillmentRepository.ts

import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { Fulfillment } from "../models/types";

export interface FulfillmentSearchFilters {
  bookingId?: string;
  fulfillmentStatus?: string;
  assignedTechnicianId?: string;
  assignedPartnerId?: string;
  priority?: string;
}

export class FulfillmentRepository {
  private readonly col = collection(getFirestore(), "fulfillments");

  async create(fulfillment: Fulfillment): Promise<void> {
    const ref = doc(this.col, fulfillment.id);
    await setDoc(ref, {
      ...fulfillment,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async getById(id: string): Promise<Fulfillment | null> {
    const snap = await getDoc(doc(this.col, id));
    if (!snap.exists()) return null;
    const data = snap.data() as Fulfillment;
    if (data.deletedAt) return null;
    return data;
  }

  async update(fulfillment: Fulfillment): Promise<void> {
    const ref = doc(this.col, fulfillment.id);
    await updateDoc(ref, { ...fulfillment, updatedAt: serverTimestamp() });
  }

  async softDelete(id: string, deletedBy: string): Promise<void> {
    const ref = doc(this.col, id);
    await updateDoc(ref, {
      deletedAt: serverTimestamp(),
      deletedBy,
    });
  }

  async search(
    filters: FulfillmentSearchFilters,
    pageSize: number,
    cursor?: DocumentSnapshot
  ): Promise<{ fulfillments: Fulfillment[]; nextCursor?: DocumentSnapshot }> {
    let q = query(this.col);
    if (filters.bookingId) q = query(q, where("bookingId", "==", filters.bookingId));
    if (filters.fulfillmentStatus) q = query(q, where("fulfillmentStatus", "==", filters.fulfillmentStatus));
    if (filters.assignedTechnicianId) q = query(q, where("assignedTechnicianId", "==", filters.assignedTechnicianId));
    if (filters.assignedPartnerId) q = query(q, where("assignedPartnerId", "==", filters.assignedPartnerId));
    if (filters.priority) q = query(q, where("priority", "==", filters.priority));

    q = query(q, orderBy("createdAt", "desc"), orderBy("__name__"));
    q = query(q, limit(pageSize));
    if (cursor) q = query(q, startAfter(cursor));

    const snap = await getDocs(q);
    const fulfillments: Fulfillment[] = [];
    snap.forEach((d) => {
      const data = d.data() as Fulfillment;
      if (!data.deletedAt) fulfillments.push(data);
    });

    const nextCursor = fulfillments.length === pageSize ? snap.docs[snap.docs.length - 1] : undefined;
    return { fulfillments, nextCursor };
  }
}
