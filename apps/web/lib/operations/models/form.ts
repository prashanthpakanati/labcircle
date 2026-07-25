// apps/web/lib/operations/models/form.ts

import { ExceptionType, ExceptionSeverity, ExceptionStatus, RegionZone } from "./enums";

export interface CreateExceptionCaseFormData {
  fulfillmentId: string;
  region: RegionZone;
  type: ExceptionType;
  severity: ExceptionSeverity;
  title: string;
  description: string;
}

export interface ResolveExceptionFormData {
  exceptionId: string;
  status: ExceptionStatus;
  resolutionNotes: string;
}

export interface CreateShiftFormData {
  technicianId: string;
  region: RegionZone;
  date: string;
  startTime: string;
  endTime: string;
  assignedPincodes: string[];
  maxCapacity: number;
}

export interface UpdateOperationsConfigFormData {
  region: RegionZone;
  slaStageDurationsMins: Record<string, number>;
  shiftDurationHours: number;
  expressDispatchRadiusKm: number;
  maxPhlebotomistDailyWorkload: number;
  alertBreachThresholdMins: number;
  featureFlags: Record<string, boolean>;
}
