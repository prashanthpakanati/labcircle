// apps/web/lib/communication/repositories/PreferenceRepository.ts

import { getFirestore, collection, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { NotificationPreference } from "../models/types";

export class PreferenceRepository {
  private readonly col = collection(getFirestore(), "user_notification_preferences");

  async getPreference(userId: string): Promise<NotificationPreference | null> {
    const snap = await getDoc(doc(this.col, userId));
    if (!snap.exists()) return null;
    return snap.data() as NotificationPreference;
  }

  async savePreference(pref: NotificationPreference): Promise<void> {
    const ref = doc(this.col, pref.userId);
    await setDoc(ref, {
      ...pref,
      updatedAt: serverTimestamp(),
    });
  }
}
