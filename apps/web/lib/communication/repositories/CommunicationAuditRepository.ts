// apps/web/lib/communication/repositories/CommunicationAuditRepository.ts

import { getFirestore, collection, doc, setDoc, query, where, orderBy, limit, startAfter, getDocs, serverTimestamp, DocumentSnapshot } from "firebase/firestore";
import { CommunicationAuditRecord } from "../models/types";

export class CommunicationAuditRepository {
  private readonly col = collection(getFirestore(), "communication_audit");

  async logAction(audit: CommunicationAuditRecord): Promise<void> {
    const ref = doc(this.col, audit.id);
    await setDoc(ref, {
      ...audit,
      timestamp: serverTimestamp(),
    });
  }

  async searchByRecipient(
    recipient: string,
    pageSize = 20,
    cursor?: DocumentSnapshot
  ): Promise<{ auditLogs: CommunicationAuditRecord[]; nextCursor?: DocumentSnapshot }> {
    let q = query(this.col, where("recipient", "==", recipient), orderBy("timestamp", "desc"), limit(pageSize));
    if (cursor) q = query(q, startAfter(cursor));

    const snap = await getDocs(q);
    const auditLogs: CommunicationAuditRecord[] = [];
    snap.forEach((d) => auditLogs.push(d.data() as CommunicationAuditRecord));

    const nextCursor = auditLogs.length === pageSize ? snap.docs[snap.docs.length - 1] : undefined;
    return { auditLogs, nextCursor };
  }
}
