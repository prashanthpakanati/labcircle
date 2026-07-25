// apps/web/lib/analytics/__tests__/service.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ReportType, ExportFormat } from "../models/enums";
import { Timestamp } from "firebase/firestore";

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn(() => ({})),
    doc: vi.fn(() => ({ id: "gen-analytics-id" })),
    setDoc: vi.fn().mockResolvedValue(undefined),
    serverTimestamp: vi.fn(() => Timestamp.now()),
  };
});

const mockExportRepo = {
  create: vi.fn().mockResolvedValue(undefined),
  getAll: vi.fn().mockResolvedValue([]),
};

const mockAuditRepo = {
  logAction: vi.fn().mockResolvedValue(undefined),
  search: vi.fn().mockResolvedValue({ auditLogs: [], nextCursor: undefined }),
};

vi.mock("../repositories/ReportExportRepository", () => ({
  ReportExportRepository: vi.fn(function () {
    return mockExportRepo;
  }),
}));

vi.mock("../repositories/AnalyticsAuditRepository", () => ({
  AnalyticsAuditRepository: vi.fn(function () {
    return mockAuditRepo;
  }),
}));

const { AnalyticsService } = await import("../services/AnalyticsService");

describe("AnalyticsService Read-Only Platform", () => {
  let service: InstanceType<typeof AnalyticsService>;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AnalyticsService();
  });

  it("returns executive metrics projection without mutating any database entity", () => {
    const metrics = service.getExecutiveMetrics();
    expect(metrics.totalRevenue).toBe(154500);
    expect(metrics.growthRatePercent).toBe(14);
  });

  it("exports analytics report and records audit entry for authorized role", async () => {
    const res = await service.exportReport(
      {
        reportType: ReportType.EXECUTIVE_SUMMARY,
        format: ExportFormat.CSV,
      },
      "exec-1",
      "Executive"
    );

    expect(res.payload).toContain("Total Revenue");
    expect(mockExportRepo.create).toHaveBeenCalledTimes(1);
    expect(mockAuditRepo.logAction).toHaveBeenCalledTimes(1);
  });

  it("denies export operation for unauthorized roles (Viewer)", async () => {
    await expect(
      service.exportReport(
        {
          reportType: ReportType.EXECUTIVE_SUMMARY,
          format: ExportFormat.CSV,
        },
        "viewer-1",
        "Viewer"
      )
    ).rejects.toThrow("Permission Denied");
  });
});
