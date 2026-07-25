// apps/web/lib/communication/repositories/TemplateRepository.ts

import { getFirestore, collection, doc, setDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { NotificationTemplate } from "../models/types";

export class TemplateRepository {
  private readonly col = collection(getFirestore(), "notification_templates");

  async create(template: NotificationTemplate): Promise<void> {
    const ref = doc(this.col, template.id);
    await setDoc(ref, {
      ...template,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async getByCode(code: string): Promise<NotificationTemplate | null> {
    const q = query(this.col, where("code", "==", code));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data() as NotificationTemplate;
  }
}
