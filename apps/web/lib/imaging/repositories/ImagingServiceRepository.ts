// apps/web/lib/imaging/repositories/ImagingServiceRepository.ts

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { COLLECTIONS } from "../models/constants";
import { ImagingService } from "../models/types";
import { ImagingMapper } from "../models/form";

export class ImagingServiceRepository {
  private db = getFirestore();

  /** Fetch a single service by ID */
  async getService(id: string): Promise<ImagingService | null> {
    const docRef = doc(this.db, COLLECTIONS.services, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return ImagingMapper.fromServiceFirestore({ id: snap.id, ...snap.data() });
  }

  /** Fetch a single service by slug */
  async getServiceBySlug(slug: string): Promise<ImagingService | null> {
    const colRef = collection(this.db, COLLECTIONS.services);
    const q = query(colRef, where("slug", "==", slug));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const docSnap = snap.docs[0];
    return ImagingMapper.fromServiceFirestore({ id: docSnap.id, ...docSnap.data() });
  }

  /** Write a new service document to Firestore */
  async createService(service: ImagingService): Promise<void> {
    const docRef = doc(this.db, COLLECTIONS.services, service.id);
    await setDoc(docRef, ImagingMapper.toServiceFirestore(service));
  }

  /** Merge updates into Service document */
  async updateService(id: string, updates: Partial<Omit<ImagingService, "id">>): Promise<void> {
    const docRef = doc(this.db, COLLECTIONS.services, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }

  /** Get all services, filtering out deleted ones unless requested */
  async listServices(includeDeleted = false): Promise<ImagingService[]> {
    const colRef = collection(this.db, COLLECTIONS.services);
    const snap = await getDocs(colRef);
    let services = snap.docs.map((d) =>
      ImagingMapper.fromServiceFirestore({ id: d.id, ...d.data() })
    );

    if (!includeDeleted) {
      services = services.filter((s) => !s.deletedAt);
    }
    return services;
  }

  /** Performs soft-delete by writing deletedAt and deletedBy fields */
  async softDeleteService(id: string, userId: string): Promise<void> {
    const docRef = doc(this.db, COLLECTIONS.services, id);
    await updateDoc(docRef, {
      deletedAt: new Date().toISOString(),
      deletedBy: userId,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    });
  }
}
