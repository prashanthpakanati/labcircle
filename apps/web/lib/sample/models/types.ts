// apps/web/lib/sample/models/types.ts

import { SampleStatus, CollectionType, CollectorType } from "./enums";

/**
 * Immutable snapshot of a single test item within a sample.
 * Captures the test details at the time of sample creation so the sample
 * record remains self-contained even if the test catalog changes later.
 */
export interface SampleItem {
  testId: string;
  testName: string;
  testCode: string;
  sampleType: string;       // e.g. "Whole Blood", "Serum", "Urine"
  containerType: string;    // e.g. "EDTA Tube", "SST Tube", "Plain Container"
}

/**
 * Core Sample domain model.
 * All timestamp fields are ISO-8601 strings for serialisation consistency.
 */
export interface Sample {
  id: string;
  displayId: string;          // e.g. SMP000001

  // References
  orderId: string;
  patientId: string;

  // Collection metadata
  collectionType: CollectionType;
  collectorType: CollectorType;
  collectorId: string;        // Staff or external phlebotomist ID

  // Status
  status: SampleStatus;

  // Immutable item snapshots
  items: SampleItem[];

  // Optional notes
  notes?: string;

  // Lifecycle timestamps (ISO strings; undefined until that stage is reached)
  collectedAt?: string;
  receivedAtLabAt?: string;
  processingStartedAt?: string;
  completedAt?: string;

  // Audit
  createdAt: string;
  updatedAt: string;
}
