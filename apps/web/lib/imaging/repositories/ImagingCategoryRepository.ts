// apps/web/lib/imaging/repositories/ImagingCategoryRepository.ts

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { COLLECTIONS } from "../models/constants";
import { ImagingCategory } from "../models/types";
import { ImagingMapper } from "../models/form";

export class ImagingCategoryRepository {
  private db = getFirestore();

  /** Fetch a single category by ID */
  async getCategory(id: string): Promise<ImagingCategory | null> {
    const docRef = doc(this.db, COLLECTIONS.categories, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return ImagingMapper.fromCategoryFirestore({ id: snap.id, ...snap.data() });
  }

  /** Write a new category to Firestore */
  async createCategory(category: ImagingCategory): Promise<void> {
    const docRef = doc(this.db, COLLECTIONS.categories, category.id);
    await setDoc(docRef, ImagingMapper.toCategoryFirestore(category));
  }

  /** Merge update payload into Category document */
  async updateCategory(id: string, updates: Partial<Omit<ImagingCategory, "id">>): Promise<void> {
    const docRef = doc(this.db, COLLECTIONS.categories, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }

  /** Get all categories, filtering out deleted ones unless explicitly requested */
  async listCategories(includeDeleted = false): Promise<ImagingCategory[]> {
    const colRef = collection(this.db, COLLECTIONS.categories);
    const snap = await getDocs(colRef);
    let categories = snap.docs.map((d) =>
      ImagingMapper.fromCategoryFirestore({ id: d.id, ...d.data() })
    );

    if (!includeDeleted) {
      categories = categories.filter((c) => !c.deletedAt);
    }
    return categories.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  /** Performs soft-delete by writing deletedAt and deletedBy fields */
  async softDeleteCategory(id: string, userId: string): Promise<void> {
    const docRef = doc(this.db, COLLECTIONS.categories, id);
    await updateDoc(docRef, {
      deletedAt: new Date().toISOString(),
      deletedBy: userId,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    });
  }
}
