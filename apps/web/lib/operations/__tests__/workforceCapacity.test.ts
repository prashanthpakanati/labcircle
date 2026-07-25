// apps/web/lib/operations/__tests__/workforceCapacity.test.ts

import { describe, it, expect } from "vitest";
import { WorkforceCapacityEngine } from "../utils/WorkforceCapacityEngine";
import { RegionZone, ShiftStatus } from "../models/enums";

describe("WorkforceCapacityEngine", () => {
  it("calculates shift capacity, utilization percentage, and overload forecast", () => {
    const shifts = [
      { id: "s-1", technicianId: "t-1", region: RegionZone.HYDERABAD_CENTRAL, date: "2026-07-25", startTime: "08:00", endTime: "16:00", status: ShiftStatus.ON_DUTY, assignedPincodes: ["500001"], maxCapacity: 10 },
      { id: "s-2", technicianId: "t-2", region: RegionZone.HYDERABAD_CENTRAL, date: "2026-07-25", startTime: "08:00", endTime: "16:00", status: ShiftStatus.ON_DUTY, assignedPincodes: ["500002"], maxCapacity: 10 },
    ];

    const res = WorkforceCapacityEngine.calculateCapacity(shifts);
    expect(res.totalTechnicians).toBe(2);
    expect(res.activeOnDuty).toBe(2);
    expect(res.availableCapacitySlots).toBe(20);
    expect(res.shiftUtilizationPercentage).toBe(65);
    expect(res.overloadForecast).toBe(false);
  });
});
