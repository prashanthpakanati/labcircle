// apps/web/lib/analytics/repositories/ReportExportRepository.ts

import { getFirestore, collection, doc, setDoc, query, orderBy, getDocs, serverTimestamp } from "firebase/firestore";
import { ReportExport } from "../models/types";

export class ReportExportRepository {
  private readonly col = collection(getFirestore(), "report_exports");

  async create(exportRecord: ReportExport): Promise<void> {
    const ref = doc(this.col, exportRecord.id);
    await setDoc(ref, {
      ...exportRecord,
      exportedAt: serverTimestamp(),
    });
  }

  async getAll(): Promise<ReportExport[]> {
    const q = query(this.col, orderBy("exportedAt", "desc"));
    const snap = await getDocs(q);
    const records: ReportExport[] = [];
    snap.forEach((d) => records.push(d.data() as ReportExport));
    return records;
  }
}
