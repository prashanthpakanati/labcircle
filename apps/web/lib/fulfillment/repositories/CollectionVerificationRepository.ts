// apps/web/lib/fulfillment/repositories/CollectionVerificationRepository.ts

import { getFirestore, collection, doc, setDoc, updateDoc, query, where, limit, getDocs, serverTimestamp } from "firebase/firestore";
import { CollectionVerification } from "../models/types";

export class CollectionVerificationRepository {
  private readonly col = collection(getFirestore(), "collection_verifications");

  async create(verification: CollectionVerification): Promise<void> {
    const ref = doc(this.col, verification.id);
    await setDoc(ref, {
      ...verification,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async getByFulfillmentId(fulfillmentId: string): Promise<CollectionVerification | null> {
    const q = query(this.col, where("fulfillmentId", "==", fulfillmentId), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data() as CollectionVerification;
  }

  async update(verification: CollectionVerification): Promise<void> {
    const ref = doc(this.col, verification.id);
    await updateDoc(ref, { ...verification, updatedAt: serverTimestamp() });
  }
}
