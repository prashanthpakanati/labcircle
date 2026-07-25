// apps/web/lib/operations/__tests__/partnerHealth.test.ts

import { describe, it, expect } from "vitest";
import { PartnerHealthEngine } from "../utils/PartnerHealthEngine";
import { RegionZone } from "../models/enums";

describe("PartnerHealthEngine", () => {
  it("calculates partner reliability score, quality trend, and downtime flags", () => {
    const records = [
      { partnerId: "p-1", partnerName: "Metropolis", region: RegionZone.HYDERABAD_CENTRAL, date: "2026-07-25", totalAllocated: 100, avgTatHours: 10, qualityScore: 96, rejectionRate: 0.2 },
    ];

    const res = PartnerHealthEngine.evaluateHealth(records);
    expect(res).toHaveLength(1);
    expect(res[0].partnerName).toBe("Metropolis");
    expect(res[0].reliabilityScore).toBeGreaterThan(80);
    expect(res[0].qualityTrend).toBe("UPWARD");
    expect(res[0].isDowntimeDetected).toBe(false);
  });
});
