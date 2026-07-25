// apps/web/lib/clinical/repositories/ReportVersionRepository.ts

import { getFirestore, collection, doc, setDoc, query, where, orderBy, getDocs, serverTimestamp } from "firebase/firestore";
import { ClinicalReportVersion } from "../models/types";

export class ReportVersionRepository {
  private readonly col = collection(getFirestore(), "report_versions");

  /**
   * Saves an immutable historical version document snapshot.
   */
  async createVersion(versionDoc: ClinicalReportVersion): Promise<void> {
    const ref = doc(this.col, versionDoc.id);
    await setDoc(ref, {
      ...versionDoc,
      createdAt: serverTimestamp(),
    });
  }

  async getVersionsByReportId(reportId: string): Promise<ClinicalReportVersion[]> {
    const q = query(this.col, where("reportId", "==", reportId), orderBy("version", "asc"));
    const snap = await getDocs(q);
    const versions: ClinicalReportVersion[] = [];
    snap.forEach((d) => versions.push(d.data() as ClinicalReportVersion));
    return versions;
  }
}
