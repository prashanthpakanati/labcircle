// apps/web/lib/operations/models/types.ts

import { Timestamp } from "firebase/firestore";
import {
  AlertSeverity,
  AlertType,
  SLAStatus,
  ExceptionType,
  ExceptionSeverity,
  ExceptionStatus,
  ShiftStatus,
  RegionZone,
} from "./enums";

export interface OperationalAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  region: RegionZone;
  entityId?: string;
  timestamp: Timestamp;
  acknowledged: boolean;
  acknowledgedBy?: string | null;
}

export interface OperationsConfig {
  id: string; // "global_config" or "region_config"
  region: RegionZone;
  slaStageDurationsMins: Record<string, number>;
  shiftDurationHours: number;
  expressDispatchRadiusKm: number;
  maxPhlebotomistDailyWorkload: number;
  alertBreachThresholdMins: number;
  featureFlags: Record<string, boolean>;
  updatedAt: Timestamp;
  updatedBy: string;
}

export interface KPIMetrics {
  collectionSuccessRate: number;
  avgDispatchTimeMins: number;
  avgCollectionTimeMins: number;
  avgLabTatHours: number;
  slaCompliancePercentage: number;
  technicianUtilizationRate: number;
  partnerCapacityUtilizationRate: number;
  expressSuccessRate: number;
  exceptionRate: number;
}

export interface WorkforceCapacity {
  totalTechnicians: number;
  activeOnDuty: number;
  availableCapacitySlots: number;
  utilizedSlots: number;
  shiftUtilizationPercentage: number;
  overloadForecast: boolean;
}

export interface PartnerHealthScore {
  partnerId: string;
  partnerName: string;
  reliabilityScore: number; // 0-100
  slaCompliancePercentage: number;
  capacityUtilizationPercentage: number;
  qualityTrend: "UPWARD" | "STABLE" | "DOWNWARD";
  isDowntimeDetected: boolean;
}

export interface DispatchAssignmentRecord {
  id: string;
  fulfillmentId: string;
  technicianId: string;
  region: RegionZone;
  status: string;
  assignedAt: Timestamp;
  reassignedFrom?: string | null;
  reassignmentReason?: string | null;
}

export interface TechnicianShiftRecord {
  id: string;
  technicianId: string;
  region: RegionZone;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: ShiftStatus;
  assignedPincodes: string[];
  maxCapacity: number;
}

export interface WorkforceProfile {
  id: string;
  employeeId: string;
  name: string;
  region: RegionZone;
  skills: string[];
  serviceAreas: string[];
  vehicleType: string;
  employmentStatus: "FULL_TIME" | "PART_TIME" | "CONTRACT";
  isActive: boolean;
}

export interface PartnerPerformanceRecord {
  partnerId: string;
  partnerName: string;
  region: RegionZone;
  date: string;
  totalAllocated: number;
  avgTatHours: number;
  qualityScore: number;
  rejectionRate: number;
}

export interface SLARecord {
  id: string;
  fulfillmentId: string;
  region: RegionZone;
  stage: string;
  targetDurationMins: number;
  elapsedMins: number;
  status: SLAStatus;
  updatedAt: Timestamp;
}

export interface ExceptionCaseRecord {
  id: string;
  fulfillmentId: string;
  region: RegionZone;
  type: ExceptionType;
  severity: ExceptionSeverity;
  status: ExceptionStatus;
  title: string;
  description: string;
  resolutionNotes?: string | null;
  assignedTo?: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface OperationsAuditRecord {
  id: string;
  action: string;
  actorId: string;
  actorRole: string;
  targetEntity: string;
  targetEntityId: string;
  changes: Record<string, unknown>;
  timestamp: Timestamp;
}

export interface OperationsCommandCenterState {
  region: RegionZone;
  activeFulfillmentsCount: number;
  pendingAssignmentsCount: number;
  samplesInTransitCount: number;
  slaBreachesCount: number;
  activeTechniciansCount: number;
  onlinePartnersCount: number;
  kpis: KPIMetrics;
  alerts: OperationalAlert[];
  capacity: WorkforceCapacity;
  partnerHealth: PartnerHealthScore[];
}
