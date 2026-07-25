// apps/web/lib/clinical/services/ClinicalReportService.ts

import { getFirestore, collection, doc, serverTimestamp, Timestamp } from "firebase/firestore";
import { ClinicalReportRepository, ReportSearchFilters } from "../repositories/ClinicalReportRepository";
import { ReportVersionRepository } from "../repositories/ReportVersionRepository";
import { ReportAuditRepository } from "../repositories/ReportAuditRepository";
import { ClinicalReport, ClinicalReportVersion, PathologistSignature, ReportAuditRecord } from "../models/types";
import { ReportStatus, ApprovalStatus, SignatureStatus } from "../models/enums";
import { CreateReportFormData, ApproveReportFormData, AmendReportFormData } from "../models/form";
import { ReportStateMachine } from "../utils/ReportStateMachine";
import { validateReportCreation, validatePathologistApproval } from "../validation/validateClinicalReport";

export type ClinicalRole = "SuperAdmin" | "Admin" | "Pathologist" | "Doctor" | "Technician" | "Patient";

const MUTATION_ROLES: ClinicalRole[] = ["SuperAdmin", "Admin", "Pathologist"];
const PATHOLOGIST_ROLES: ClinicalRole[] = ["SuperAdmin", "Pathologist"];

export class ClinicalReportService {
  private repo = new ClinicalReportRepository();
  private versionRepo = new ReportVersionRepository();
  private auditRepo = new ReportAuditRepository();
  private db = getFirestore();

  private assertRole(role: ClinicalRole, allowed: ClinicalRole[], action: string): void {
    if (!allowed.includes(role)) {
      throw new Error(`Permission Denied: Role '${role}' is not authorized to ${action}.`);
    }
  }

  private async recordAudit(reportId: string, action: string, actorId: string, actorRole: ClinicalRole, changes: Record<string, unknown>): Promise<void> {
    const id = doc(collection(this.db, "report_audit")).id;
    const now = serverTimestamp() as unknown as Timestamp;
    const record: ReportAuditRecord = {
      id,
      reportId,
      action,
      actorId,
      actorRole,
      changes,
      timestamp: now,
    };
    await this.auditRepo.logAction(record);
  }

  private async saveVersionSnapshot(report: ClinicalReport, amendmentReason?: string, createdByName = "System"): Promise<void> {
    const id = doc(collection(this.db, "report_versions")).id;
    const now = serverTimestamp() as unknown as Timestamp;

    const versionDoc: ClinicalReportVersion = {
      id,
      reportId: report.id,
      version: report.version,
      reportSnapshot: report,
      amendmentReason,
      createdByName,
      createdAt: now,
    };

    await this.versionRepo.createVersion(versionDoc);
  }

  // ── Public API ──────────────────────────────────────────────────────────

  async getReport(id: string): Promise<ClinicalReport | null> {
    return this.repo.getById(id);
  }

  async searchReports(filters: ReportSearchFilters = {}, pageSize = 20) {
    return this.repo.search(filters, pageSize);
  }

  async getVersionHistory(reportId: string): Promise<ClinicalReportVersion[]> {
    return this.versionRepo.getVersionsByReportId(reportId);
  }

  /**
   * Initializes a new clinical diagnostic report.
   */
  async createReport(formData: CreateReportFormData, actorId: string, actorRole: ClinicalRole): Promise<ClinicalReport> {
    this.assertRole(actorRole, MUTATION_ROLES, "create clinical report");

    const val = validateReportCreation(formData);
    if (!val.isValid) throw new Error(`Report validation failed: ${JSON.stringify(val.errors)}`);

    const id = doc(collection(this.db, "clinical_reports")).id;
    const now = serverTimestamp() as unknown as Timestamp;
    const hasCriticalValue = formData.observations.some((o) => o.isCritical);

    const report: ClinicalReport = {
      id,
      version: 1,
      bookingId: formData.bookingId,
      fulfillmentId: formData.fulfillmentId,
      patientId: formData.patientId,
      patientName: formData.patientName,
      patientAge: formData.patientAge,
      patientGender: formData.patientGender,
      serviceCategory: formData.serviceCategory,
      status: ReportStatus.GENERATED,
      approvalStatus: ApprovalStatus.PENDING,
      observations: formData.observations,
      summaryNotes: formData.summaryNotes,
      hasCriticalValue,
      pathologistSignature: null,
      createdAt: now,
      updatedAt: now,
      createdBy: actorId,
      updatedBy: actorId,
    };

    await this.repo.create(report);
    await this.saveVersionSnapshot(report, "Initial Report Generation", actorId);
    await this.recordAudit(id, "CREATE_REPORT", actorId, actorRole, formData as unknown as Record<string, unknown>);

    return report;
  }

  /**
   * Pathologist digital signature and report approval.
   */
  async approveReport(formData: ApproveReportFormData, actorId: string, actorRole: ClinicalRole): Promise<ClinicalReport> {
    this.assertRole(actorRole, PATHOLOGIST_ROLES, "approve report as pathologist");

    const val = validatePathologistApproval(formData);
    if (!val.isValid) throw new Error(`Approval validation failed: ${JSON.stringify(val.errors)}`);

    const existing = await this.repo.getById(formData.reportId);
    if (!existing) throw new Error(`Report '${formData.reportId}' not found`);

    ReportStateMachine.validateTransition(existing.status, ReportStatus.PATHOLOGIST_APPROVED);

    const now = serverTimestamp() as unknown as Timestamp;
    const sigHash = `SIG-${formData.pathologistId}-${Date.now()}`;

    const signature: PathologistSignature = {
      pathologistId: formData.pathologistId,
      pathologistName: formData.pathologistName,
      medicalLicenseNumber: formData.medicalLicenseNumber,
      signedAt: now,
      digitalSignatureHash: sigHash,
      signatureStatus: SignatureStatus.DIGITALLY_SIGNED,
    };

    const updated: ClinicalReport = {
      ...existing,
      status: ReportStatus.PATHOLOGIST_APPROVED,
      approvalStatus: ApprovalStatus.APPROVED,
      pathologistSignature: signature,
      summaryNotes: formData.summaryNotes ?? existing.summaryNotes,
      updatedBy: actorId,
      updatedAt: now,
    };

    await this.repo.update(updated);
    await this.saveVersionSnapshot(updated, "Pathologist Digital Approval", formData.pathologistName);
    await this.recordAudit(existing.id, "APPROVE_REPORT", actorId, actorRole, { signatureHash: sigHash });

    return updated;
  }

  /**
   * Publishes report to patient vault.
   */
  async publishReport(reportId: string, actorId: string, actorRole: ClinicalRole): Promise<ClinicalReport> {
    this.assertRole(actorRole, MUTATION_ROLES, "publish report");

    const existing = await this.repo.getById(reportId);
    if (!existing) throw new Error(`Report '${reportId}' not found`);

    ReportStateMachine.validateTransition(existing.status, ReportStatus.PUBLISHED);

    const now = serverTimestamp() as unknown as Timestamp;
    const updated: ClinicalReport = {
      ...existing,
      status: ReportStatus.PUBLISHED,
      updatedBy: actorId,
      updatedAt: now,
    };

    await this.repo.update(updated);
    await this.recordAudit(reportId, "PUBLISH_REPORT", actorId, actorRole, { status: ReportStatus.PUBLISHED });

    return updated;
  }

  /**
   * Amends report and increments immutable version number.
   */
  async amendReport(formData: AmendReportFormData, actorId: string, actorRole: ClinicalRole): Promise<ClinicalReport> {
    this.assertRole(actorRole, PATHOLOGIST_ROLES, "amend report");

    const existing = await this.repo.getById(formData.reportId);
    if (!existing) throw new Error(`Report '${formData.reportId}' not found`);

    const now = serverTimestamp() as unknown as Timestamp;
    const nextVersion = existing.version + 1;
    const hasCriticalValue = formData.observations.some((o) => o.isCritical);

    const updated: ClinicalReport = {
      ...existing,
      version: nextVersion,
      status: ReportStatus.UNDER_REVIEW,
      approvalStatus: ApprovalStatus.AMENDED,
      observations: formData.observations,
      hasCriticalValue,
      pathologistSignature: null, // Requires re-approval after amendment
      updatedBy: actorId,
      updatedAt: now,
    };

    await this.repo.update(updated);
    await this.saveVersionSnapshot(updated, formData.amendmentReason, formData.pathologistName);
    await this.recordAudit(existing.id, "AMEND_REPORT", actorId, actorRole, { amendmentReason: formData.amendmentReason, newVersion: nextVersion });

    return updated;
  }
}
