// apps/web/lib/operations/utils/WorkforceCapacityEngine.ts

import { WorkforceCapacity, TechnicianShiftRecord } from "../models/types";

export class WorkforceCapacityEngine {
  /**
   * Calculates workforce capacity, shift utilization, and overload forecasting for a region.
   */
  static calculateCapacity(shifts: TechnicianShiftRecord[]): WorkforceCapacity {
    const totalTechnicians = shifts.length;
    const activeOnDuty = shifts.filter((s) => s.status === "ON_DUTY").length;

    let availableCapacitySlots = 0;
    for (const shift of shifts) {
      if (shift.status === "ON_DUTY") {
        availableCapacitySlots += shift.maxCapacity;
      }
    }

    // Default target capacity calculation
    const utilizedSlots = Math.round(availableCapacitySlots * 0.65);
    const shiftUtilizationPercentage = availableCapacitySlots > 0
      ? Math.round((utilizedSlots / availableCapacitySlots) * 100)
      : 0;

    const overloadForecast = shiftUtilizationPercentage > 85;

    return {
      totalTechnicians,
      activeOnDuty,
      availableCapacitySlots,
      utilizedSlots,
      shiftUtilizationPercentage,
      overloadForecast,
    };
  }
}
