// apps/web/lib/operations/__tests__/slaEngine.test.ts

import { describe, it, expect } from "vitest";
import { SLAEngine } from "../utils/SLAEngine";
import { SLAStatus, RegionZone } from "../models/enums";
import { Timestamp } from "firebase/firestore";
import { SLARecord } from "../models/types";

describe("SLAEngine", () => {
  it("evaluates GREEN status for on-track elapsed time", () => {
    const status = SLAEngine.evaluateStageSLA("DISPATCH", 5, 15);
    expect(status).toBe(SLAStatus.GREEN);
  });

  it("evaluates YELLOW status for warning threshold elapsed time", () => {
    const status = SLAEngine.evaluateStageSLA("DISPATCH", 12, 15);
    expect(status).toBe(SLAStatus.YELLOW);
  });

  it("evaluates RED status for breached stage threshold", () => {
    const status = SLAEngine.evaluateStageSLA("DISPATCH", 20, 15);
    expect(status).toBe(SLAStatus.RED);
  });

  it("identifies overdue RED breach cases accurately", () => {
    const records: SLARecord[] = [
      { id: "sla-1", fulfillmentId: "f-1", region: RegionZone.HYDERABAD_CENTRAL, stage: "DISPATCH", targetDurationMins: 15, elapsedMins: 5, status: SLAStatus.GREEN, updatedAt: { seconds: 1000 } as unknown as Timestamp },
      { id: "sla-2", fulfillmentId: "f-2", region: RegionZone.HYDERABAD_CENTRAL, stage: "COLLECTION", targetDurationMins: 60, elapsedMins: 65, status: SLAStatus.RED, updatedAt: { seconds: 1000 } as unknown as Timestamp },
    ];

    const breaches = SLAEngine.identifyBreaches(records);
    expect(breaches).toHaveLength(1);
    expect(breaches[0].id).toBe("sla-2");
  });
});
