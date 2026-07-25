// apps/web/lib/commerce/repositories/CommerceAuditRepository.ts

import { getFirestore, collection, doc, setDoc, query, where, orderBy, limit, startAfter, getDocs, serverTimestamp, DocumentSnapshot } from "firebase/firestore";
import { CommerceAuditRecord } from "../models/types";

export class CommerceAuditRepository {
  private readonly col = collection(getFirestore(), "pricing_audit");

  async logAction(audit: CommerceAuditRecord): Promise<void> {
    const ref = doc(this.col, audit.id);
    await setDoc(ref, {
      ...audit,
      timestamp: serverTimestamp(),
    });
  }

  async search(
    targetEntity?: string,
    actorId?: string,
    pageSize = 20,
    cursor?: DocumentSnapshot
  ): Promise<{ auditLogs: CommerceAuditRecord[]; nextCursor?: DocumentSnapshot }> {
    let q = query(this.col);
    if (targetEntity) q = query(q, where("targetEntity", "==", targetEntity));
    if (actorId) q = query(q, where("actorId", "==", actorId));

    q = query(q, orderBy("timestamp", "desc"), orderBy("__name__"));
    q = query(q, limit(pageSize));
    if (cursor) q = query(q, startAfter(cursor));

    const snap = await getDocs(q);
    const auditLogs: CommerceAuditRecord[] = [];
    snap.forEach((d) => auditLogs.push(d.data() as CommerceAuditRecord));

    const nextCursor = auditLogs.length === pageSize ? snap.docs[snap.docs.length - 1] : undefined;
    return { auditLogs, nextCursor };
  }
}
