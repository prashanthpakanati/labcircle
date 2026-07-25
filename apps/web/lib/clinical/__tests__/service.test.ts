// apps/web/lib/clinical/__tests__/service.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ReportStatus, ReferenceRangeType } from "../models/enums";
import { Timestamp } from "firebase/firestore";

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn(() => ({})),
    doc: vi.fn(() => ({ id: "gen-clin-id" })),
    serverTimestamp: vi.fn(() => Timestamp.now()),
  };
});

const mockReportRepo = {
  create: vi.fn().mockResolvedValue(undefined),
  getById: vi.fn().mockResolvedValue({
    id: "rep-100",
    version: 1,
    bookingId: "b-1",
    fulfillmentId: "f-1",
    patientId: "p-1",
    patientName: "Jane Doe",
    patientAge: 32,
    patientGender: "FEMALE",
    serviceCategory: "LAB_TEST",
    status: ReportStatus.UNDER_REVIEW,
    approvalStatus: "PENDING",
    observations: [
      {
        id: "obs-1",
        testCode: "HEMOGLOBIN",
        testName: "Hemoglobin",
        value: 12.5,
        unit: "g/dL",
        referenceRangeText: "12.0 - 15.5 g/dL",
        rangeType: ReferenceRangeType.NORMAL,
        isAbnormal: false,
        isCritical: false,
      },
    ],
    hasCriticalValue: false,
    pathologistSignature: null,
    createdAt: { seconds: 1000 },
    updatedAt: { seconds: 1000 },
    createdBy: "user-1",
    updatedBy: "user-1",
  }),
  update: vi.fn().mockResolvedValue(undefined),
  search: vi.fn().mockResolvedValue({ reports: [], nextCursor: undefined }),
};

const mockVersionRepo = {
  createVersion: vi.fn().mockResolvedValue(undefined),
  getVersionsByReportId: vi.fn().mockResolvedValue([]),
};

const mockAuditRepo = {
  logAction: vi.fn().mockResolvedValue(undefined),
  searchByReportId: vi.fn().mockResolvedValue({ auditLogs: [], nextCursor: undefined }),
};

vi.mock("../repositories/ClinicalReportRepository", () => ({
  ClinicalReportRepository: vi.fn(function () {
    return mockReportRepo;
  }),
}));

vi.mock("../repositories/ReportVersionRepository", () => ({
  ReportVersionRepository: vi.fn(function () {
    return mockVersionRepo;
  }),
}));

vi.mock("../repositories/ReportAuditRepository", () => ({
  ReportAuditRepository: vi.fn(function () {
    return mockAuditRepo;
  }),
}));

const { ClinicalReportService } = await import("../services/ClinicalReportService");

describe("ClinicalReportService", () => {
  let service: InstanceType<typeof ClinicalReportService>;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ClinicalReportService();
  });

  it("creates clinical report and saves initial version snapshot + audit log", async () => {
    const report = await service.createReport(
      {
        bookingId: "b-1",
        fulfillmentId: "f-1",
        patientId: "p-1",
        patientName: "Jane Doe",
        patientAge: 32,
        patientGender: "FEMALE",
        serviceCategory: "LAB_TEST",
        observations: [
          {
            id: "obs-1",
            testCode: "CBC",
            testName: "Complete Blood Count",
            value: 14.0,
            unit: "g/dL",
            referenceRangeText: "12.0 - 15.5 g/dL",
            rangeType: ReferenceRangeType.NORMAL,
            isAbnormal: false,
            isCritical: false,
          },
        ],
      },
      "user-tech",
      "Pathologist"
    );

    expect(report.status).toBe(ReportStatus.GENERATED);
    expect(mockReportRepo.create).toHaveBeenCalledTimes(1);
    expect(mockVersionRepo.createVersion).toHaveBeenCalledTimes(1);
    expect(mockAuditRepo.logAction).toHaveBeenCalledTimes(1);
  });

  it("approves report with digital signature for Pathologist role", async () => {
    const approved = await service.approveReport(
      {
        reportId: "rep-100",
        pathologistId: "path-1",
        pathologistName: "Dr. Smith",
        medicalLicenseNumber: "LIC-889911",
      },
      "path-1",
      "Pathologist"
    );

    expect(approved.status).toBe(ReportStatus.PATHOLOGIST_APPROVED);
    expect(approved.pathologistSignature?.digitalSignatureHash).toMatch(/SIG-path-1/);
    expect(mockReportRepo.update).toHaveBeenCalledTimes(1);
  });

  it("amends report and creates new version snapshot v2", async () => {
    const amended = await service.amendReport(
      {
        reportId: "rep-100",
        observations: [
          {
            id: "obs-1",
            testCode: "HEMOGLOBIN",
            testName: "Hemoglobin",
            value: 12.8,
            unit: "g/dL",
            referenceRangeText: "12.0 - 15.5 g/dL",
            rangeType: ReferenceRangeType.NORMAL,
            isAbnormal: false,
            isCritical: false,
          },
        ],
        amendmentReason: "Corrected calibration value",
        pathologistId: "path-1",
        pathologistName: "Dr. Smith",
      },
      "path-1",
      "Pathologist"
    );

    expect(amended.version).toBe(2);
    expect(amended.status).toBe(ReportStatus.UNDER_REVIEW);
    expect(mockVersionRepo.createVersion).toHaveBeenCalledTimes(1);
  });

  it("denies mutation operations for unauthorized roles (Patient)", async () => {
    await expect(
      service.createReport(
        {
          bookingId: "b-1",
          fulfillmentId: "f-1",
          patientId: "p-1",
          patientName: "Jane Doe",
          patientAge: 32,
          patientGender: "FEMALE",
          serviceCategory: "LAB_TEST",
          observations: [],
        },
        "patient-1",
        "Patient"
      )
    ).rejects.toThrow("Permission Denied");
  });
});
