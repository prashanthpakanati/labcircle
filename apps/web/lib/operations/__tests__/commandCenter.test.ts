// apps/web/lib/operations/__tests__/commandCenter.test.ts

import { describe, it, expect } from "vitest";
import { OperationsCommandCenter } from "../utils/OperationsCommandCenter";
import { RegionZone, SLAStatus, ShiftStatus } from "../models/enums";
import { Timestamp } from "firebase/firestore";

describe("OperationsCommandCenter", () => {
  it("composes unified operational state for dashboard widgets", () => {
    const state = OperationsCommandCenter.composeState(
      RegionZone.HYDERABAD_CENTRAL,
      50,
      4,
      10,
      8,
      3,
      [
        { id: "s-1", fulfillmentId: "f-1", region: RegionZone.HYDERABAD_CENTRAL, stage: "DISPATCH", targetDurationMins: 15, elapsedMins: 20, status: SLAStatus.RED, updatedAt: { seconds: 1000 } as unknown as Timestamp },
      ],
      [
        { id: "sh-1", technicianId: "p-1", region: RegionZone.HYDERABAD_CENTRAL, date: "2026-07-25", startTime: "08:00", endTime: "16:00", status: ShiftStatus.ON_DUTY, assignedPincodes: ["500001"], maxCapacity: 15 },
      ],
      [
        { partnerId: "p-1", partnerName: "Apollo Lab", region: RegionZone.HYDERABAD_CENTRAL, date: "2026-07-25", totalAllocated: 100, avgTatHours: 12, qualityScore: 98, rejectionRate: 0.5 },
      ]
    );

    expect(state.region).toBe(RegionZone.HYDERABAD_CENTRAL);
    expect(state.activeFulfillmentsCount).toBe(50);
    expect(state.slaBreachesCount).toBe(1);
    expect(state.alerts.length).toBeGreaterThan(0);
    expect(state.partnerHealth).toHaveLength(1);
    expect(state.kpis.collectionSuccessRate).toBeGreaterThan(0);
  });
});
