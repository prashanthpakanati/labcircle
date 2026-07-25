// apps/web/lib/operations/services/OperationsCommandCenterService.ts

import { getFirestore, collection, doc, serverTimestamp, Timestamp } from "firebase/firestore";
import { OperationsAuditRepository } from "../repositories/OperationsAuditRepository";
import { OperationsConfigRepository } from "../repositories/OperationsConfigRepository";
import { ExceptionRepository } from "../repositories/ExceptionRepository";
import { WorkforceRepository } from "../repositories/WorkforceRepository";
import { RegionZone, ExceptionStatus, ShiftStatus } from "../models/enums";
import { OperationsCommandCenterState, OperationsConfig, ExceptionCaseRecord, TechnicianShiftRecord, OperationsAuditRecord } from "../models/types";
import { OperationsCommandCenter } from "../utils/OperationsCommandCenter";
import { CreateExceptionCaseFormData, CreateShiftFormData, UpdateOperationsConfigFormData } from "../models/form";
import { validateExceptionCase, validateShiftCreation } from "../validation/validateOperations";

export type ConsoleRole = "SuperAdmin" | "Admin" | "OperationsManager" | "Dispatcher" | "PartnerManager" | "Viewer";

const MUTATION_ROLES: ConsoleRole[] = ["SuperAdmin", "Admin", "OperationsManager", "Dispatcher"];
const ADMIN_ROLES: ConsoleRole[] = ["SuperAdmin", "Admin"];

export class OperationsCommandCenterService {
  private auditRepo = new OperationsAuditRepository();
  private configRepo = new OperationsConfigRepository();
  private exceptionRepo = new ExceptionRepository();
  private workforceRepo = new WorkforceRepository();
  private db = getFirestore();

  private assertRole(role: ConsoleRole, allowed: ConsoleRole[], action: string): void {
    if (!allowed.includes(role)) {
      throw new Error(`Permission Denied: Console role '${role}' is not authorized to ${action}.`);
    }
  }

  private async audit(action: string, actorId: string, actorRole: ConsoleRole, targetEntity: string, targetEntityId: string, changes: Record<string, unknown>): Promise<void> {
    const id = doc(collection(this.db, "operations_audit")).id;
    const now = serverTimestamp() as unknown as Timestamp;
    const record: OperationsAuditRecord = {
      id,
      action,
      actorId,
      actorRole,
      targetEntity,
      targetEntityId,
      changes,
      timestamp: now,
    };
    await this.auditRepo.logAction(record);
  }

  // ── Command Center State Aggregation ──────────────────────────────────

  async getCommandCenterState(region: RegionZone): Promise<OperationsCommandCenterState> {
    const today = new Date().toISOString().split("T")[0];
    const shifts = await this.workforceRepo.getShiftsByRegionAndDate(region, today);
    const mockPartnerPerformance = [
      {
        partnerId: "lab-1",
        partnerName: "Apollo Central Lab",
        region,
        date: today,
        totalAllocated: 250,
        avgTatHours: 11.5,
        qualityScore: 98,
        rejectionRate: 0.4,
      },
    ];

    return OperationsCommandCenter.composeState(
      region,
      42, // Active fulfillments
      5,  // Pending assignments
      12, // In transit
      shifts.filter((s) => s.status === "ON_DUTY").length || 8,
      4,  // Online partners
      [], // Active SLA records
      shifts,
      mockPartnerPerformance
    );
  }

  // ── Operational Configuration ──────────────────────────────────────────

  async getConfig(region: RegionZone): Promise<OperationsConfig> {
    const existing = await this.configRepo.getConfig(region);
    if (existing) return existing;

    const defaultConfig: OperationsConfig = {
      id: region,
      region,
      slaStageDurationsMins: {
        DISPATCH: 15,
        COLLECTION: 60,
        TRANSIT: 90,
        PROCESSING: 360,
        REPORT_DELIVERY: 720,
      },
      shiftDurationHours: 8,
      expressDispatchRadiusKm: 5,
      maxPhlebotomistDailyWorkload: 15,
      alertBreachThresholdMins: 15,
      featureFlags: {
        enableGpsTracking: true,
        enableAutoDispatch: true,
      },
      updatedAt: serverTimestamp() as unknown as Timestamp,
      updatedBy: "system",
    };

    await this.configRepo.saveConfig(defaultConfig);
    return defaultConfig;
  }

  async updateConfig(formData: UpdateOperationsConfigFormData, actorId: string, actorRole: ConsoleRole): Promise<OperationsConfig> {
    this.assertRole(actorRole, ADMIN_ROLES, "update operations configuration");

    const existing = await this.getConfig(formData.region);
    const updated: OperationsConfig = {
      ...existing,
      slaStageDurationsMins: formData.slaStageDurationsMins,
      shiftDurationHours: formData.shiftDurationHours,
      expressDispatchRadiusKm: formData.expressDispatchRadiusKm,
      maxPhlebotomistDailyWorkload: formData.maxPhlebotomistDailyWorkload,
      alertBreachThresholdMins: formData.alertBreachThresholdMins,
      featureFlags: formData.featureFlags,
      updatedBy: actorId,
      updatedAt: serverTimestamp() as unknown as Timestamp,
    };

    await this.configRepo.saveConfig(updated);
    await this.audit("UPDATE_CONFIG", actorId, actorRole, "operations_config", formData.region, formData as unknown as Record<string, unknown>);
    return updated;
  }

  // ── Exception Management ───────────────────────────────────────────────

  async createExceptionCase(formData: CreateExceptionCaseFormData, actorId: string, actorRole: ConsoleRole): Promise<ExceptionCaseRecord> {
    this.assertRole(actorRole, MUTATION_ROLES, "create exception case");

    const val = validateExceptionCase(formData);
    if (!val.isValid) throw new Error(`Validation failed: ${JSON.stringify(val.errors)}`);

    const id = doc(collection(this.db, "exception_cases")).id;
    const now = serverTimestamp() as unknown as Timestamp;

    const record: ExceptionCaseRecord = {
      id,
      fulfillmentId: formData.fulfillmentId,
      region: formData.region,
      type: formData.type,
      severity: formData.severity,
      status: ExceptionStatus.OPEN,
      title: formData.title,
      description: formData.description,
      createdAt: now,
      updatedAt: now,
    };

    await this.exceptionRepo.create(record);
    await this.audit("CREATE_EXCEPTION", actorId, actorRole, "exception_cases", id, formData as unknown as Record<string, unknown>);
    return record;
  }

  async resolveExceptionCase(exceptionId: string, resolutionNotes: string, actorId: string, actorRole: ConsoleRole): Promise<void> {
    this.assertRole(actorRole, MUTATION_ROLES, "resolve exception case");

    const existing = await this.exceptionRepo.getById(exceptionId);
    if (!existing) throw new Error(`Exception case '${exceptionId}' not found`);

    const updated: ExceptionCaseRecord = {
      ...existing,
      status: ExceptionStatus.RESOLVED,
      resolutionNotes,
      updatedAt: serverTimestamp() as unknown as Timestamp,
    };

    await this.exceptionRepo.update(updated);
    await this.audit("RESOLVE_EXCEPTION", actorId, actorRole, "exception_cases", exceptionId, { resolutionNotes });
  }

  // ── Workforce Shift Planning ────────────────────────────────────────────

  async createShift(formData: CreateShiftFormData, actorId: string, actorRole: ConsoleRole): Promise<TechnicianShiftRecord> {
    this.assertRole(actorRole, MUTATION_ROLES, "create technician shift");

    const val = validateShiftCreation(formData);
    if (!val.isValid) throw new Error(`Validation failed: ${JSON.stringify(val.errors)}`);

    const id = doc(collection(this.db, "technician_shifts")).id;
    const shift: TechnicianShiftRecord = {
      id,
      technicianId: formData.technicianId,
      region: formData.region,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      status: ShiftStatus.SCHEDULED,
      assignedPincodes: formData.assignedPincodes,
      maxCapacity: formData.maxCapacity,
    };

    await this.workforceRepo.createShift(shift);
    await this.audit("CREATE_SHIFT", actorId, actorRole, "technician_shifts", id, formData as unknown as Record<string, unknown>);
    return shift;
  }
}
