// apps/web/lib/sample/models/enums.ts

export enum SampleStatus {
  PendingCollection = "PendingCollection",
  Collected = "Collected",
  ReceivedAtLab = "ReceivedAtLab",
  Processing = "Processing",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

export enum CollectionType {
  Home = "Home",
  Lab = "Lab",
  External = "External",
}

export enum CollectorType {
  Internal = "Internal",
  External = "External",
  Patient = "Patient",
}
