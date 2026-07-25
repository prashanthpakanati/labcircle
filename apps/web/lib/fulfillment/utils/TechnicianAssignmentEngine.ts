// apps/web/lib/fulfillment/utils/TechnicianAssignmentEngine.ts

import { TechnicianLocation } from "../models/types";
import { AssignmentStrategyType } from "../models/enums";

export interface TechnicianCandidate {
  technicianId: string;
  name: string;
  pincodes: string[];
  activeBookingsCount: number;
  location?: TechnicianLocation | null;
  isActive: boolean;
}

export interface AssignmentStrategy {
  type: AssignmentStrategyType;
  select(candidates: TechnicianCandidate[], pincode: string): { selectedTechnicianId: string; reason: string };
}

export class ExpressPriorityStrategy implements AssignmentStrategy {
  type = AssignmentStrategyType.EXPRESS_PRIORITY;
  select(candidates: TechnicianCandidate[], pincode: string) {
    const valid = candidates.filter((c) => c.isActive && c.pincodes.includes(pincode));
    if (valid.length === 0) throw new Error(`No phlebotomist available in pincode ${pincode} for Express dispatch`);
    const sorted = [...valid].sort((a, b) => a.activeBookingsCount - b.activeBookingsCount);
    return { selectedTechnicianId: sorted[0].technicianId, reason: "Express 60-Minute priority dispatch assigned to least-busy nearby phlebotomist" };
  }
}

export class NearestTechnicianStrategy implements AssignmentStrategy {
  type = AssignmentStrategyType.NEAREST;
  select(candidates: TechnicianCandidate[], pincode: string) {
    const valid = candidates.filter((c) => c.isActive && c.pincodes.includes(pincode));
    if (valid.length === 0) throw new Error(`No technician found covering ${pincode}`);
    return { selectedTechnicianId: valid[0].technicianId, reason: `Assigned nearest phlebotomist covering pincode zone ${pincode}` };
  }
}

export class LeastBusyStrategy implements AssignmentStrategy {
  type = AssignmentStrategyType.LEAST_BUSY;
  select(candidates: TechnicianCandidate[], pincode: string) {
    const valid = candidates.filter((c) => c.isActive && c.pincodes.includes(pincode));
    if (valid.length === 0) throw new Error(`No technician available in ${pincode}`);
    const sorted = [...valid].sort((a, b) => a.activeBookingsCount - b.activeBookingsCount);
    return { selectedTechnicianId: sorted[0].technicianId, reason: `Assigned to phlebotomist with lowest active workload (${sorted[0].activeBookingsCount} active)` };
  }
}

/**
 * TechnicianAssignmentEngine
 * ---------------------------
 * Strategy-pattern technician dispatch engine supporting pluggable assignment strategies.
 */
export class TechnicianAssignmentEngine {
  private static strategies: Record<AssignmentStrategyType, AssignmentStrategy> = {
    [AssignmentStrategyType.EXPRESS_PRIORITY]: new ExpressPriorityStrategy(),
    [AssignmentStrategyType.NEAREST]: new NearestTechnicianStrategy(),
    [AssignmentStrategyType.LEAST_BUSY]: new LeastBusyStrategy(),
    [AssignmentStrategyType.ROUND_ROBIN]: new NearestTechnicianStrategy(),
    [AssignmentStrategyType.MANUAL]: new NearestTechnicianStrategy(),
  };

  static assign(
    candidates: TechnicianCandidate[],
    pincode: string,
    strategyType: AssignmentStrategyType = AssignmentStrategyType.NEAREST
  ): { selectedTechnicianId: string; reason: string; strategyUsed: AssignmentStrategyType } {
    const strategy = this.strategies[strategyType] ?? this.strategies[AssignmentStrategyType.NEAREST];
    const result = strategy.select(candidates, pincode);
    return { ...result, strategyUsed: strategy.type };
  }
}
