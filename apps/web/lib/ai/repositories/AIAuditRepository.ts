// apps/web/lib/ai/repositories/AIAuditRepository.ts

import { getFirestore, collection, doc, setDoc, query, orderBy, limit, startAfter, getDocs, serverTimestamp, DocumentSnapshot } from "firebase/firestore";
import { AIAuditRecord } from "../models/types";

export class AIAuditRepository {
  private readonly col = collection(getFirestore(), "ai_audit");

  async logAction(audit: AIAuditRecord): Promise<void> {
    const ref = doc(this.col, audit.id);
    await setDoc(ref, {
      ...audit,
      timestamp: serverTimestamp(),
    });
  }

  async search(
    pageSize = 20,
    cursor?: DocumentSnapshot
  ): Promise<{ auditLogs: AIAuditRecord[]; nextCursor?: DocumentSnapshot }> {
    let q = query(this.col, orderBy("timestamp", "desc"), limit(pageSize));
    if (cursor) q = query(q, startAfter(cursor));

    const snap = await getDocs(q);
    const auditLogs: AIAuditRecord[] = [];
    snap.forEach((d) => auditLogs.push(d.data() as AIAuditRecord));

    const nextCursor = auditLogs.length === pageSize ? snap.docs[snap.docs.length - 1] : undefined;
    return { auditLogs, nextCursor };
  }
}
