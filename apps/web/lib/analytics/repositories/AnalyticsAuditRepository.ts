// apps/web/lib/analytics/repositories/AnalyticsAuditRepository.ts

import { getFirestore, collection, doc, setDoc, query, where, orderBy, limit, startAfter, getDocs, serverTimestamp, DocumentSnapshot } from "firebase/firestore";
import { AnalyticsAuditRecord } from "../models/types";

export class AnalyticsAuditRepository {
  private readonly col = collection(getFirestore(), "analytics_audit");

  async logAction(audit: AnalyticsAuditRecord): Promise<void> {
    const ref = doc(this.col, audit.id);
    await setDoc(ref, {
      ...audit,
      timestamp: serverTimestamp(),
    });
  }

  async search(
    actorId?: string,
    pageSize = 20,
    cursor?: DocumentSnapshot
  ): Promise<{ auditLogs: AnalyticsAuditRecord[]; nextCursor?: DocumentSnapshot }> {
    let q = query(this.col);
    if (actorId) q = query(q, where("actorId", "==", actorId));

    q = query(q, orderBy("timestamp", "desc"), orderBy("__name__"));
    q = query(q, limit(pageSize));
    if (cursor) q = query(q, startAfter(cursor));

    const snap = await getDocs(q);
    const auditLogs: AnalyticsAuditRecord[] = [];
    snap.forEach((d) => auditLogs.push(d.data() as AnalyticsAuditRecord));

    const nextCursor = auditLogs.length === pageSize ? snap.docs[snap.docs.length - 1] : undefined;
    return { auditLogs, nextCursor };
  }
}
