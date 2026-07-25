// apps/web/lib/integration/repositories/IntegrationAuditRepository.ts

import { getFirestore, collection, doc, setDoc, query, orderBy, limit, startAfter, getDocs, serverTimestamp, DocumentSnapshot } from "firebase/firestore";
import { IntegrationAuditRecord } from "../models/types";

export class IntegrationAuditRepository {
  private readonly col = collection(getFirestore(), "integration_audit");

  async logAction(audit: IntegrationAuditRecord): Promise<void> {
    const ref = doc(this.col, audit.id);
    await setDoc(ref, {
      ...audit,
      timestamp: serverTimestamp(),
    });
  }

  async search(
    pageSize = 20,
    cursor?: DocumentSnapshot
  ): Promise<{ auditLogs: IntegrationAuditRecord[]; nextCursor?: DocumentSnapshot }> {
    let q = query(this.col, orderBy("timestamp", "desc"), limit(pageSize));
    if (cursor) q = query(q, startAfter(cursor));

    const snap = await getDocs(q);
    const auditLogs: IntegrationAuditRecord[] = [];
    snap.forEach((d) => auditLogs.push(d.data() as IntegrationAuditRecord));

    const nextCursor = auditLogs.length === pageSize ? snap.docs[snap.docs.length - 1] : undefined;
    return { auditLogs, nextCursor };
  }
}
