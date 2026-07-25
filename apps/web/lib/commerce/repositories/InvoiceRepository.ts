// apps/web/lib/commerce/repositories/InvoiceRepository.ts

import { getFirestore, collection, doc, setDoc, getDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { Invoice } from "../models/types";

export class InvoiceRepository {
  private readonly col = collection(getFirestore(), "invoices");

  async create(invoice: Invoice): Promise<void> {
    const ref = doc(this.col, invoice.id);
    await setDoc(ref, {
      ...invoice,
      issuedAt: serverTimestamp(),
    });
  }

  async getById(id: string): Promise<Invoice | null> {
    const snap = await getDoc(doc(this.col, id));
    if (!snap.exists()) return null;
    return snap.data() as Invoice;
  }

  async getByBookingId(bookingId: string): Promise<Invoice | null> {
    const q = query(this.col, where("bookingId", "==", bookingId));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data() as Invoice;
  }
}
