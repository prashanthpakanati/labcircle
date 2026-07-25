// apps/web/lib/clinical/repositories/ClinicalReportRepository.ts

import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, query, where, orderBy, limit, startAfter, getDocs, serverTimestamp, DocumentSnapshot } from "firebase/firestore";
import { ClinicalReport } from "../models/types";
import { ReportStatus } from "../models/enums";

export interface ReportSearchFilters {
  patientId?: string;
  bookingId?: string;
  fulfillmentId?: string;
  status?: ReportStatus;
  hasCriticalValue?: boolean;
}

export class ClinicalReportRepository {
  private readonly col = collection(getFirestore(), "clinical_reports");

  async create(report: ClinicalReport): Promise<void> {
    const ref = doc(this.col, report.id);
    await setDoc(ref, {
      ...report,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async getById(id: string): Promise<ClinicalReport | null> {
    const snap = await getDoc(doc(this.col, id));
    if (!snap.exists()) return null;
    return snap.data() as ClinicalReport;
  }

  async update(report: ClinicalReport): Promise<void> {
    const ref = doc(this.col, report.id);
    await updateDoc(ref, {
      ...report,
      updatedAt: serverTimestamp(),
    });
  }

  async search(
    filters: ReportSearchFilters,
    pageSize = 20,
    cursor?: DocumentSnapshot
  ): Promise<{ reports: ClinicalReport[]; nextCursor?: DocumentSnapshot }> {
    let q = query(this.col);
    if (filters.patientId) q = query(q, where("patientId", "==", filters.patientId));
    if (filters.bookingId) q = query(q, where("bookingId", "==", filters.bookingId));
    if (filters.fulfillmentId) q = query(q, where("fulfillmentId", "==", filters.fulfillmentId));
    if (filters.status) q = query(q, where("status", "==", filters.status));
    if (filters.hasCriticalValue !== undefined) q = query(q, where("hasCriticalValue", "==", filters.hasCriticalValue));

    q = query(q, orderBy("createdAt", "desc"), orderBy("__name__"));
    q = query(q, limit(pageSize));
    if (cursor) q = query(q, startAfter(cursor));

    const snap = await getDocs(q);
    const reports: ClinicalReport[] = [];
    snap.forEach((d) => reports.push(d.data() as ClinicalReport));

    const nextCursor = reports.length === pageSize ? snap.docs[snap.docs.length - 1] : undefined;
    return { reports, nextCursor };
  }
}
