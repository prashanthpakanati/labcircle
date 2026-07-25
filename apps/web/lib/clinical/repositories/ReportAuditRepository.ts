// apps/web/lib/clinical/repositories/ReportAuditRepository.ts

import { getFirestore, collection, doc, setDoc, query, where, orderBy, limit, startAfter, getDocs, serverTimestamp, DocumentSnapshot } from "firebase/firestore";
import { ReportAuditRecord } from "../models/types";

export class ReportAuditRepository {
  private readonly col = collection(getFirestore(), "report_audit");

  /**
   * Writes an immutable report audit log entry.
   */
  async logAction(audit: ReportAuditRecord): Promise<void> {
    const ref = doc(this.col, audit.id);
    await setDoc(ref, {
      ...audit,
      timestamp: serverTimestamp(),
    });
  }

  async searchByReportId(
    reportId: string,
    pageSize = 20,
    cursor?: DocumentSnapshot
  ): Promise<{ auditLogs: ReportAuditRecord[]; nextCursor?: DocumentSnapshot }> {
    let q = query(this.col, where("reportId", "==", reportId), orderBy("timestamp", "desc"), limit(pageSize));
    if (cursor) q = query(q, startAfter(cursor));

    const snap = await getDocs(q);
    const auditLogs: ReportAuditRecord[] = [];
    snap.forEach((d) => auditLogs.push(d.data() as ReportAuditRecord));

    const nextCursor = auditLogs.length === pageSize ? snap.docs[snap.docs.length - 1] : undefined;
    return { auditLogs, nextCursor };
  }
}
