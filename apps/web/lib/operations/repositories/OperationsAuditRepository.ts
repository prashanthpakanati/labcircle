// apps/web/lib/operations/repositories/OperationsAuditRepository.ts

import { getFirestore, collection, doc, setDoc, query, where, orderBy, limit, startAfter, getDocs, serverTimestamp, DocumentSnapshot } from "firebase/firestore";
import { OperationsAuditRecord } from "../models/types";

export class OperationsAuditRepository {
  private readonly col = collection(getFirestore(), "operations_audit");

  /**
   * Adds an immutable write-once operational audit record document.
   */
  async logAction(audit: OperationsAuditRecord): Promise<void> {
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
  ): Promise<{ auditLogs: OperationsAuditRecord[]; nextCursor?: DocumentSnapshot }> {
    let q = query(this.col);
    if (targetEntity) q = query(q, where("targetEntity", "==", targetEntity));
    if (actorId) q = query(q, where("actorId", "==", actorId));

    q = query(q, orderBy("timestamp", "desc"), orderBy("__name__"));
    q = query(q, limit(pageSize));
    if (cursor) q = query(q, startAfter(cursor));

    const snap = await getDocs(q);
    const auditLogs: OperationsAuditRecord[] = [];
    snap.forEach((d) => auditLogs.push(d.data() as OperationsAuditRecord));

    const nextCursor = auditLogs.length === pageSize ? snap.docs[snap.docs.length - 1] : undefined;
    return { auditLogs, nextCursor };
  }
}
