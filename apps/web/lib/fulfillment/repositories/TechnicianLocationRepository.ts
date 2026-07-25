// apps/web/lib/fulfillment/repositories/TechnicianLocationRepository.ts

import { getFirestore, collection, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { TechnicianLocation } from "../models/types";

export class TechnicianLocationRepository {
  private readonly col = collection(getFirestore(), "technician_locations");

  async updateLocation(location: TechnicianLocation): Promise<void> {
    const ref = doc(this.col, location.technicianId);
    await setDoc(ref, {
      ...location,
      lastUpdated: serverTimestamp(),
    });
  }

  async getByTechnicianId(technicianId: string): Promise<TechnicianLocation | null> {
    const snap = await getDoc(doc(this.col, technicianId));
    if (!snap.exists()) return null;
    return snap.data() as TechnicianLocation;
  }
}
