// apps/web/lib/fulfillment/repositories/SampleRepository.ts

import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { Sample } from "../models/types";

export class SampleRepository {
  private readonly col = collection(getFirestore(), "samples");

  async create(sample: Sample): Promise<void> {
    const ref = doc(this.col, sample.id);
    await setDoc(ref, {
      ...sample,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async getById(id: string): Promise<Sample | null> {
    const snap = await getDoc(doc(this.col, id));
    if (!snap.exists()) return null;
    return snap.data() as Sample;
  }

  async getByFulfillmentId(fulfillmentId: string): Promise<Sample[]> {
    const q = query(this.col, where("fulfillmentId", "==", fulfillmentId));
    const snap = await getDocs(q);
    const samples: Sample[] = [];
    snap.forEach((d) => samples.push(d.data() as Sample));
    return samples;
  }

  async update(sample: Sample): Promise<void> {
    const ref = doc(this.col, sample.id);
    await updateDoc(ref, { ...sample, updatedAt: serverTimestamp() });
  }
}
