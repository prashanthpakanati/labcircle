// apps/web/lib/operations/repositories/WorkforceRepository.ts

import { getFirestore, collection, doc, setDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { TechnicianShiftRecord, WorkforceProfile } from "../models/types";
import { RegionZone } from "../models/enums";

export class WorkforceRepository {
  private readonly shiftCol = collection(getFirestore(), "technician_shifts");
  private readonly profileCol = collection(getFirestore(), "workforce_profiles");

  async createShift(shift: TechnicianShiftRecord): Promise<void> {
    const ref = doc(this.shiftCol, shift.id);
    await setDoc(ref, {
      ...shift,
      createdAt: serverTimestamp(),
    });
  }

  async getShiftsByRegionAndDate(region: RegionZone, date: string): Promise<TechnicianShiftRecord[]> {
    const q = query(this.shiftCol, where("region", "==", region), where("date", "==", date));
    const snap = await getDocs(q);
    const shifts: TechnicianShiftRecord[] = [];
    snap.forEach((d) => shifts.push(d.data() as TechnicianShiftRecord));
    return shifts;
  }

  async createProfile(profile: WorkforceProfile): Promise<void> {
    const ref = doc(this.profileCol, profile.id);
    await setDoc(ref, {
      ...profile,
      createdAt: serverTimestamp(),
    });
  }

  async getProfilesByRegion(region: RegionZone): Promise<WorkforceProfile[]> {
    const q = query(this.profileCol, where("region", "==", region), where("isActive", "==", true));
    const snap = await getDocs(q);
    const profiles: WorkforceProfile[] = [];
    snap.forEach((d) => profiles.push(d.data() as WorkforceProfile));
    return profiles;
  }
}
