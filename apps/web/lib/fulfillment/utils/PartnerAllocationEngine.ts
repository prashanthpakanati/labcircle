// apps/web/lib/fulfillment/utils/PartnerAllocationEngine.ts

import { ProcessingPartner } from "../models/types";
import { AllocationStrategyType } from "../models/enums";

export interface AllocationStrategy {
  type: AllocationStrategyType;
  evaluate(partners: ProcessingPartner[], pincode: string): { selectedPartner: ProcessingPartner; score: number; reason: string };
}

export class CapacityStrategy implements AllocationStrategy {
  type = AllocationStrategyType.CAPACITY;
  evaluate(partners: ProcessingPartner[], pincode: string) {
    const valid = partners.filter((p) => p.isActive && p.serviceablePincodes.includes(pincode));
    if (valid.length === 0) throw new Error(`No partner covers pincode ${pincode}`);
    const sorted = [...valid].sort((a, b) => a.dailyCapacity - a.currentLoad - (b.dailyCapacity - b.currentLoad));
    const best = sorted[sorted.length - 1];
    const score = Math.round(((best.dailyCapacity - best.currentLoad) / best.dailyCapacity) * 100);
    return { selectedPartner: best, score, reason: `Selected by highest available capacity (${best.dailyCapacity - best.currentLoad} slots open)` };
  }
}

export class QualityStrategy implements AllocationStrategy {
  type = AllocationStrategyType.QUALITY;
  evaluate(partners: ProcessingPartner[], pincode: string) {
    const valid = partners.filter((p) => p.isActive && p.serviceablePincodes.includes(pincode));
    if (valid.length === 0) throw new Error(`No partner covers pincode ${pincode}`);
    const sorted = [...valid].sort((a, b) => b.qualityScore - a.qualityScore);
    const best = sorted[0];
    return { selectedPartner: best, score: best.qualityScore, reason: `Selected by highest quality score (${best.qualityScore}/100)` };
  }
}

export class NearestStrategy implements AllocationStrategy {
  type = AllocationStrategyType.NEAREST;
  evaluate(partners: ProcessingPartner[], pincode: string) {
    const valid = partners.filter((p) => p.isActive && p.serviceablePincodes.includes(pincode));
    if (valid.length === 0) throw new Error(`No partner covers pincode ${pincode}`);
    const best = valid[0]; // Pincode match priority
    return { selectedPartner: best, score: 90, reason: `Selected by nearest pincode coverage zone (${pincode})` };
  }
}

export class HybridStrategy implements AllocationStrategy {
  type = AllocationStrategyType.HYBRID;
  evaluate(partners: ProcessingPartner[], pincode: string) {
    const valid = partners.filter((p) => p.isActive && p.serviceablePincodes.includes(pincode));
    if (valid.length === 0) throw new Error(`No partner covers pincode ${pincode}`);
    
    // Weighted scoring: Quality 40%, Capacity 40%, TAT 20%
    const scored = valid.map((p) => {
      const capRatio = (p.dailyCapacity - p.currentLoad) / p.dailyCapacity;
      const score = Math.round(p.qualityScore * 0.4 + capRatio * 100 * 0.4 + (100 - p.avgTurnaroundHours) * 0.2);
      return { partner: p, score };
    }).sort((a, b) => b.score - a.score);

    const best = scored[0];
    return { selectedPartner: best.partner, score: best.score, reason: `Selected by Hybrid strategy (Quality, Capacity & TAT composite score: ${best.score})` };
  }
}

/**
 * PartnerAllocationEngine
 * -----------------------
 * Strategy-pattern allocation engine for selecting generic ProcessingPartners.
 * Supports interchangeable strategies (Hybrid, Capacity, Quality, Nearest).
 */
export class PartnerAllocationEngine {
  private static strategies: Record<AllocationStrategyType, AllocationStrategy> = {
    [AllocationStrategyType.CAPACITY]: new CapacityStrategy(),
    [AllocationStrategyType.QUALITY]: new QualityStrategy(),
    [AllocationStrategyType.NEAREST]: new NearestStrategy(),
    [AllocationStrategyType.TAT]: new HybridStrategy(),
    [AllocationStrategyType.HYBRID]: new HybridStrategy(),
  };

  static allocate(
    partners: ProcessingPartner[],
    pincode: string,
    strategyType: AllocationStrategyType = AllocationStrategyType.HYBRID
  ): { selectedPartner: ProcessingPartner; score: number; reason: string; strategyUsed: AllocationStrategyType } {
    const strategy = this.strategies[strategyType] ?? this.strategies[AllocationStrategyType.HYBRID];
    const result = strategy.evaluate(partners, pincode);
    return { ...result, strategyUsed: strategy.type };
  }
}
