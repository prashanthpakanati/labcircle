// apps/web/lib/test/services/TestService.ts

import { getFirestore, collection, doc, setDoc, getDoc, getDocs, Timestamp, runTransaction } from "firebase/firestore";
import { TEST_COLLECTION } from "../models/constants";
import { Test } from "../models/types";
import { TestStatus } from "../models/enums";
import { TestFormData } from "../models/form";

/**
 * TestService implements CRUD operations for the Test domain.
 * Follows the exact architecture and patterns established in PatientService.
 */
export class TestService {
  private db = getFirestore();

  /** Create a new test and generate a displayId (TST000001). */
  async createTest(form: TestFormData): Promise<Test> {
    const testRef = doc(collection(this.db, TEST_COLLECTION));
    const counterRef = doc(this.db, "counters", "tests");

    // Transaction to atomically increment counter and obtain the new displayId.
    const newCount = await runTransaction(this.db, async (tx) => {
      const snap = await tx.get(counterRef);
      const current = snap.exists() ? (snap.data() as { value: number }).value : 0;
      const next = current + 1;
      tx.set(counterRef, { value: next });
      return next;
    });

    const displayId = `TST${String(newCount).padStart(6, "0")}`;
    const now = Timestamp.now();
    const test: Test = {
      id: testRef.id,
      displayId,
      name: form.name,
      code: form.code,
      department: form.department,
      category: form.category,
      specimenType: form.specimenType,
      method: form.method,
      tatHours: form.tatHours,
      urgentTatHours: form.urgentTatHours,
      mrp: form.mrp,
      b2bPrice: form.b2bPrice,
      labCirclePrice: form.labCirclePrice,
      homeCollection: form.homeCollection,
      status: TestStatus.Active,
      createdAt: now.toDate().toISOString(),
      updatedAt: now.toDate().toISOString(),
    };
    await setDoc(testRef, test);
    return test;
  }

  /** Retrieve a test by Firestore document ID. */
  async getTest(id: string): Promise<Test> {
    const snap = await getDoc(doc(this.db, TEST_COLLECTION, id));
    if (!snap.exists()) throw new Error(`Test ${id} not found`);
    return snap.data() as Test;
  }

  /** List all tests. */
  async listTests(): Promise<Test[]> {
    const colRef = collection(this.db, TEST_COLLECTION);
    const snap = await getDocs(colRef);
    return snap.docs.map((d) => d.data() as Test);
  }

  /** Update mutable fields of a test. */
  async updateTest(id: string, updates: Partial<TestFormData> & { status?: TestStatus }): Promise<void> {
    const testRef = doc(this.db, TEST_COLLECTION, id);
    const upd = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    await setDoc(testRef, upd, { merge: true });
  }

  /** Deactivate a test (set status to Inactive). */
  async deactivateTest(id: string): Promise<void> {
    await this.updateTest(id, { status: TestStatus.Inactive });
  }
}
