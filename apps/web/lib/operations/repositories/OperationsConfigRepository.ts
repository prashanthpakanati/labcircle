// apps/web/lib/operations/repositories/OperationsConfigRepository.ts

import { getFirestore, collection, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { OperationsConfig } from "../models/types";
import { RegionZone } from "../models/enums";

export class OperationsConfigRepository {
  private readonly col = collection(getFirestore(), "operations_config");

  async getConfig(region: RegionZone): Promise<OperationsConfig | null> {
    const snap = await getDoc(doc(this.col, region));
    if (!snap.exists()) return null;
    return snap.data() as OperationsConfig;
  }

  async saveConfig(config: OperationsConfig): Promise<void> {
    const ref = doc(this.col, config.region);
    await setDoc(ref, {
      ...config,
      updatedAt: serverTimestamp(),
    });
  }
}
