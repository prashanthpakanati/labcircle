// apps/web/lib/operations/repositories/ExceptionRepository.ts

import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, query, where, orderBy, limit, startAfter, getDocs, serverTimestamp, DocumentSnapshot } from "firebase/firestore";
import { ExceptionCaseRecord } from "../models/types";
import { RegionZone, ExceptionStatus } from "../models/enums";

export class ExceptionRepository {
  private readonly col = collection(getFirestore(), "exception_cases");

  async create(exception: ExceptionCaseRecord): Promise<void> {
    const ref = doc(this.col, exception.id);
    await setDoc(ref, {
      ...exception,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async getById(id: string): Promise<ExceptionCaseRecord | null> {
    const snap = await getDoc(doc(this.col, id));
    if (!snap.exists()) return null;
    return snap.data() as ExceptionCaseRecord;
  }

  async update(exception: ExceptionCaseRecord): Promise<void> {
    const ref = doc(this.col, exception.id);
    await updateDoc(ref, {
      ...exception,
      updatedAt: serverTimestamp(),
    });
  }

  async search(
    region?: RegionZone,
    status?: ExceptionStatus,
    pageSize = 20,
    cursor?: DocumentSnapshot
  ): Promise<{ exceptions: ExceptionCaseRecord[]; nextCursor?: DocumentSnapshot }> {
    let q = query(this.col);
    if (region) q = query(q, where("region", "==", region));
    if (status) q = query(q, where("status", "==", status));

    q = query(q, orderBy("createdAt", "desc"), orderBy("__name__"));
    q = query(q, limit(pageSize));
    if (cursor) q = query(q, startAfter(cursor));

    const snap = await getDocs(q);
    const exceptions: ExceptionCaseRecord[] = [];
    snap.forEach((d) => exceptions.push(d.data() as ExceptionCaseRecord));

    const nextCursor = exceptions.length === pageSize ? snap.docs[snap.docs.length - 1] : undefined;
    return { exceptions, nextCursor };
  }
}
