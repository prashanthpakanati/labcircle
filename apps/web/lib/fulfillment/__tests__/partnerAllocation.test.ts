// apps/web/lib/fulfillment/__tests__/partnerAllocation.test.ts

import { describe, it, expect } from "vitest";
import { PartnerAllocationEngine } from "../utils/PartnerAllocationEngine";
import { ProcessingPartner } from "../models/types";
import { AllocationStrategyType, PartnerType } from "../models/enums";

const mockPartners: ProcessingPartner[] = [
  {
    id: "lab-1",
    name: "Apollo Central Lab",
    code: "APOLLO-LAB",
    partnerType: PartnerType.LABORATORY,
    accreditations: ["NABL", "CAP"],
    serviceablePincodes: ["500001", "500002"],
    dailyCapacity: 500,
    currentLoad: 100,
    avgTurnaroundHours: 12,
    qualityScore: 98,
    isActive: true,
  },
  {
    id: "lab-2",
    name: "Metropolis Diagnostics",
    code: "METROPOLIS",
    partnerType: PartnerType.LABORATORY,
    accreditations: ["NABL"],
    serviceablePincodes: ["500001"],
    dailyCapacity: 200,
    currentLoad: 190, // Heavy load
    avgTurnaroundHours: 24,
    qualityScore: 90,
    isActive: true,
  },
];

describe("PartnerAllocationEngine Strategy Pattern", () => {
  it("allocates partner using CapacityStrategy", () => {
    const res = PartnerAllocationEngine.allocate(
      mockPartners,
      "500001",
      AllocationStrategyType.CAPACITY
    );

    expect(res.selectedPartner.id).toBe("lab-1");
    expect(res.reason).toMatch(/highest available capacity/);
  });

  it("allocates partner using QualityStrategy", () => {
    const res = PartnerAllocationEngine.allocate(
      mockPartners,
      "500001",
      AllocationStrategyType.QUALITY
    );

    expect(res.selectedPartner.id).toBe("lab-1");
    expect(res.score).toBe(98);
  });

  it("allocates partner using default HybridStrategy", () => {
    const res = PartnerAllocationEngine.allocate(
      mockPartners,
      "500001",
      AllocationStrategyType.HYBRID
    );

    expect(res.selectedPartner.id).toBe("lab-1");
    expect(res.strategyUsed).toBe(AllocationStrategyType.HYBRID);
  });
});
