// apps/web/lib/integration/repositories/APIRepository.ts

import { getFirestore, collection, doc, setDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { APIClient, APIKey } from "../models/types";

export class APIRepository {
  private readonly clientCol = collection(getFirestore(), "api_clients");
  private readonly keyCol = collection(getFirestore(), "api_keys");

  async createClient(client: APIClient): Promise<void> {
    const ref = doc(this.clientCol, client.id);
    await setDoc(ref, {
      ...client,
      createdAt: serverTimestamp(),
    });
  }

  async createKey(key: APIKey): Promise<void> {
    const ref = doc(this.keyCol, key.id);
    await setDoc(ref, {
      ...key,
      createdAt: serverTimestamp(),
    });
  }

  async getKeyByHash(keyHash: string): Promise<APIKey | null> {
    const q = query(this.keyCol, where("keyHash", "==", keyHash));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data() as APIKey;
  }
}
