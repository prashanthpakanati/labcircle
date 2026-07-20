// apps/web/lib/sample/models/form.ts

import { Sample, SampleItem } from "./types";
import { CollectionType, CollectorType, SampleStatus } from "./enums";

/**
 * SampleFormData — the writeable fields used when creating or updating a Sample.
 * Immutable snapshot fields (items) are passed in at creation time and never mutated.
 */
export interface SampleFormData {
  orderId: string;
  patientId: string;
  collectionType: CollectionType;
  collectorType: CollectorType;
  collectorId: string;
  items: SampleItem[];
  notes?: string;

  // Lifecycle timestamps provided by the caller when advancing status
  collectedAt?: string;
  receivedAtLabAt?: string;
  processingStartedAt?: string;
  completedAt?: string;
}

/**
 * SampleMapper — bidirectional mapping between the Firestore Sample model
 * and SampleFormData.  Mirrors the patterns in OrderMapper and TestMapper.
 */
export const SampleMapper = {
  /** Convert a persisted Sample to SampleFormData for pre-filling a form. */
  toSampleForm(sample: Sample): SampleFormData {
    return {
      orderId: sample.orderId,
      patientId: sample.patientId,
      collectionType: sample.collectionType,
      collectorType: sample.collectorType,
      collectorId: sample.collectorId,
      items: sample.items,
      notes: sample.notes,
      collectedAt: sample.collectedAt,
      receivedAtLabAt: sample.receivedAtLabAt,
      processingStartedAt: sample.processingStartedAt,
      completedAt: sample.completedAt,
    };
  },

  /** Merge SampleFormData with optional overrides into a full Sample record. */
  toSample(form: SampleFormData, overrides?: Partial<Sample>): Sample {
    return {
      ...overrides,
      ...form,
    } as Sample;
  },

  /** Serialise a Sample to a plain Firestore-safe object. */
  toFirestore(sample: Sample): Record<string, unknown> {
    return {
      id: sample.id,
      displayId: sample.displayId,
      orderId: sample.orderId,
      patientId: sample.patientId,
      collectionType: sample.collectionType,
      collectorType: sample.collectorType,
      collectorId: sample.collectorId,
      status: sample.status,
      items: sample.items,
      notes: sample.notes ?? "",
      collectedAt: sample.collectedAt ?? null,
      receivedAtLabAt: sample.receivedAtLabAt ?? null,
      processingStartedAt: sample.processingStartedAt ?? null,
      completedAt: sample.completedAt ?? null,
      createdAt: sample.createdAt,
      updatedAt: sample.updatedAt,
    };
  },

  /** Deserialise a Firestore document snapshot into a Sample. */
  fromFirestore(data: Record<string, unknown>): Sample {
    return {
      id: data.id as string,
      displayId: data.displayId as string,
      orderId: data.orderId as string,
      patientId: data.patientId as string,
      collectionType: data.collectionType as CollectionType,
      collectorType: data.collectorType as CollectorType,
      collectorId: data.collectorId as string,
      status: data.status as SampleStatus,
      items: (data.items as SampleItem[]) ?? [],
      notes: (data.notes as string) || undefined,
      collectedAt: (data.collectedAt as string) || undefined,
      receivedAtLabAt: (data.receivedAtLabAt as string) || undefined,
      processingStartedAt: (data.processingStartedAt as string) || undefined,
      completedAt: (data.completedAt as string) || undefined,
      createdAt: data.createdAt as string,
      updatedAt: data.updatedAt as string,
    };
  },
};
