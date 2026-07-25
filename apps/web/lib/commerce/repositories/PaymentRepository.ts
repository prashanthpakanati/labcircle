// apps/web/lib/commerce/repositories/PaymentRepository.ts

import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, query, where, orderBy, getDocs, serverTimestamp } from "firebase/firestore";
import { PaymentTransaction } from "../models/types";

export class PaymentRepository {
  private readonly col = collection(getFirestore(), "payment_transactions");

  async create(payment: PaymentTransaction): Promise<void> {
    const ref = doc(this.col, payment.id);
    await setDoc(ref, {
      ...payment,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async getById(id: string): Promise<PaymentTransaction | null> {
    const snap = await getDoc(doc(this.col, id));
    if (!snap.exists()) return null;
    return snap.data() as PaymentTransaction;
  }

  async getByBookingId(bookingId: string): Promise<PaymentTransaction[]> {
    const q = query(this.col, where("bookingId", "==", bookingId), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const payments: PaymentTransaction[] = [];
    snap.forEach((d) => payments.push(d.data() as PaymentTransaction));
    return payments;
  }

  async update(payment: PaymentTransaction): Promise<void> {
    const ref = doc(this.col, payment.id);
    await updateDoc(ref, { ...payment, updatedAt: serverTimestamp() });
  }
}
