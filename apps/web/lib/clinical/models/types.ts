// apps/web/lib/clinical/models/types.ts

import { Timestamp } from "firebase/firestore";
import {
  ReportStatus,
  AlertSeverity,
  AlertType,
  TrendDirection,
  ReferenceRangeType,
  KnowledgeCategory,
  ShareType,
  ApprovalStatus,
  SignatureStatus,
} from "./enums";

export interface ClinicalObservation {
  id: string;
  testCode: string;
  testName: string;
  loincCode?: string;
  snomedCode?: string;
  value: number | string;
  unit: string;
  referenceRangeText: string;
  rangeType: ReferenceRangeType;
  interpretation?: string;
  isAbnormal: boolean;
  isCritical: boolean;
}

export interface PathologistSignature {
  pathologistId: string;
  pathologistName: string;
  medicalLicenseNumber: string;
  signedAt: Timestamp;
  digitalSignatureHash: string;
  signatureStatus: SignatureStatus;
}

export interface ClinicalReport {
  id: string;
  version: number;
  bookingId: string;
  fulfillmentId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: "MALE" | "FEMALE" | "OTHER";
  serviceCategory: string;
  status: ReportStatus;
  approvalStatus: ApprovalStatus;
  observations: ClinicalObservation[];
  summaryNotes?: string;
  pathologistSignature?: PathologistSignature | null;
  hasCriticalValue: boolean;
  pdfUrl?: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  updatedBy: string;
}

export interface ClinicalReportVersion {
  id: string;
  reportId: string;
  version: number;
  reportSnapshot: ClinicalReport;
  amendmentReason?: string;
  createdByName: string;
  createdAt: Timestamp;
}

export interface ClinicalKnowledge {
  id: string;
  testCode: string;
  testName: string;
  category: KnowledgeCategory;
  loincCode?: string;
  snomedCode?: string;
  plainLanguageSummary: string;
  clinicalContext: string;
  lifestyleRecommendations: string[];
  preventiveGuidance: string[];
  disclaimer: string;
}

export interface TestDefinition {
  id: string;
  code: string;
  name: string;
  category: KnowledgeCategory;
  specimenType: string;
  unit: string;
  loincCode?: string;
  snomedCode?: string;
}

export interface ReferenceRange {
  id: string;
  testCode: string;
  gender: "MALE" | "FEMALE" | "ALL";
  minAgeYears: number;
  maxAgeYears: number;
  lowValue?: number;
  highValue?: number;
  unit: string;
  textRepresentation: string;
}

export interface PatientTimelineBiomarkerPoint {
  reportId: string;
  date: string;
  value: number;
  unit: string;
  isAbnormal: boolean;
}

export interface PatientTimeline {
  patientId: string;
  biomarkerCode: string;
  biomarkerName: string;
  points: PatientTimelineBiomarkerPoint[];
  currentTrend: TrendDirection;
}

export interface ClinicalAlert {
  id: string;
  reportId: string;
  patientId: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  acknowledged: boolean;
  createdAt: Timestamp;
}

export interface ProviderComment {
  id: string;
  reportId: string;
  authorId: string;
  authorName: string;
  authorRole: "PATHOLOGIST" | "DOCTOR" | "ADMIN";
  commentText: string;
  isInternalOnly: boolean;
  createdAt: Timestamp;
}

export interface ReportAuditRecord {
  id: string;
  reportId: string;
  action: string;
  actorId: string;
  actorRole: string;
  changes: Record<string, unknown>;
  timestamp: Timestamp;
}

export interface ReportShare {
  id: string;
  reportId: string;
  patientId: string;
  shareType: ShareType;
  sharedWithEmail?: string;
  shareToken: string;
  expiresAt: Timestamp;
  viewCount: number;
  maxViews?: number;
  createdAt: Timestamp;
}
