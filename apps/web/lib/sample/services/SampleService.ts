// apps/web/lib/sample/services/SampleService.ts

import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  Timestamp,
  runTransaction,
} from "firebase/firestore";
import {
  SAMPLE_COLLECTION,
  SAMPLE_COUNTER_KEY,
  SAMPLE_DISPLAY_ID_PREFIX,
  SAMPLE_DISPLAY_ID_PAD,
} from "../models/constants";
import { Sample } from "../models/types";
import { SampleStatus } from "../models/enums";
import { SampleFormData, SampleMapper } from "../models/form";
import { validateSample } from "../validation/validateSample";
import { canTransition } from "../utils/workflow";

/**
 * SampleService implements CRUD operations for the Sample domain.
 * Follows the identical architecture established in PatientService,
 * TestService, and OrderService.
 */
export class SampleService {
  private db = getFirestore();

  /**
   * Create a new Sample.
   * - Atomically increments the `samples` counter to generate a sequential displayId.
   * - Validates the form before writing to Firestore.
   * - Stores an immutable snapshot of each SampleItem.
   */
  async createSample(form: SampleFormData): Promise<Sample> {
    const validation = validateSample(form);
    if (!validation.isValid) {
      throw new Error(
        `Sample validation failed: ${Object.values(validation.errors).join(", ")}`
      );
    }

    const sampleRef = doc(collection(this.db, SAMPLE_COLLECTION));
    const counterRef = doc(this.db, "counters", SAMPLE_COUNTER_KEY);

    // Atomically increment counter
    const newCount = await runTransaction(this.db, async (tx) => {
      const snap = await tx.get(counterRef);
      const current = snap.exists() ? (snap.data() as { value: number }).value : 0;
      const next = current + 1;
      tx.set(counterRef, { value: next });
      return next;
    });

    const displayId = `${SAMPLE_DISPLAY_ID_PREFIX}${String(newCount).padStart(
      SAMPLE_DISPLAY_ID_PAD,
      "0"
    )}`;
    const now = Timestamp.now().toDate().toISOString();

    const sample: Sample = {
      id: sampleRef.id,
      displayId,
      orderId: form.orderId,
      patientId: form.patientId,
      collectionType: form.collectionType,
      collectorType: form.collectorType,
      collectorId: form.collectorId,
      status: SampleStatus.PendingCollection,
      // Store immutable item snapshots
      items: form.items.map((item) => ({ ...item })),
      notes: form.notes ?? "",
      collectedAt: form.collectedAt,
      receivedAtLabAt: form.receivedAtLabAt,
      processingStartedAt: form.processingStartedAt,
      completedAt: form.completedAt,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(sampleRef, SampleMapper.toFirestore(sample));
    return sample;
  }

  /** Retrieve a single Sample by Firestore document ID. */
  async getSample(id: string): Promise<Sample> {
    const snap = await getDoc(doc(this.db, SAMPLE_COLLECTION, id));
    if (!snap.exists()) throw new Error(`Sample ${id} not found`);
    return SampleMapper.fromFirestore(snap.data() as Record<string, unknown>);
  }

  /** List all Samples. */
  async listSamples(): Promise<Sample[]> {
    const snap = await getDocs(collection(this.db, SAMPLE_COLLECTION));
    return snap.docs.map((d) =>
      SampleMapper.fromFirestore(d.data() as Record<string, unknown>)
    );
  }

  /**
   * Update mutable fields of an existing Sample.
   * When `status` is provided, delegates to `updateSampleStatus` for status validation and timestamps.
   */
  async updateSample(
    id: string,
    updates: Partial<SampleFormData> & { status?: SampleStatus }
  ): Promise<void> {
    const otherUpdates = { ...updates };
    if (otherUpdates.status !== undefined) {
      await this.updateSampleStatus(id, otherUpdates.status);
      delete otherUpdates.status;
      if (Object.keys(otherUpdates).length === 0) return;
    }

    const upd = {
      ...otherUpdates,
      updatedAt: Timestamp.now().toDate().toISOString(),
    };

    await setDoc(doc(this.db, SAMPLE_COLLECTION, id), upd, { merge: true });
  }

  /**
   * Controlled status transition method.
   * Validates transition using the centralized workflow engine (`canTransition`),
   * updates status, sets lifecycle timestamps automatically without overwriting existing ones,
   * and updates `updatedAt`.
   */
  async updateSampleStatus(id: string, newStatus: SampleStatus): Promise<void> {
    const existing = await this.getSample(id);

    if (!canTransition(existing.status, newStatus)) {
      throw new Error(
        `Invalid status transition: Cannot transition from ${existing.status} to ${newStatus}`
      );
    }

    const now = Timestamp.now().toDate().toISOString();

    const timestampUpdates: Partial<Sample> = {};

    switch (newStatus) {
      case SampleStatus.Collected:
        if (!existing.collectedAt) {
          timestampUpdates.collectedAt = now;
        }
        break;
      case SampleStatus.ReceivedAtLab:
        if (!existing.receivedAtLabAt) {
          timestampUpdates.receivedAtLabAt = now;
        }
        break;
      case SampleStatus.Processing:
        if (!existing.processingStartedAt) {
          timestampUpdates.processingStartedAt = now;
        }
        break;
      case SampleStatus.Completed:
        if (!existing.completedAt) {
          timestampUpdates.completedAt = now;
        }
        break;
    }

    const upd = {
      status: newStatus,
      ...timestampUpdates,
      updatedAt: now,
    };

    await setDoc(doc(this.db, SAMPLE_COLLECTION, id), upd, { merge: true });
  }
}
