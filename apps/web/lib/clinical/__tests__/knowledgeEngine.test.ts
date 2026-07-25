// apps/web/lib/clinical/__tests__/knowledgeEngine.test.ts

import { describe, it, expect } from "vitest";
import { ClinicalKnowledgeEngine } from "../utils/ClinicalKnowledgeEngine";
import { ReferenceRangeType } from "../models/enums";
import { ReferenceRange } from "../models/types";

describe("ClinicalKnowledgeEngine", () => {
  const refRange: ReferenceRange = {
    id: "ref-hba1c",
    testCode: "HBA1C",
    gender: "ALL",
    minAgeYears: 18,
    maxAgeYears: 99,
    lowValue: 4.0,
    highValue: 5.6,
    unit: "%",
    textRepresentation: "4.0 - 5.6 %",
  };

  it("evaluates value within normal biological reference bounds", () => {
    const res = ClinicalKnowledgeEngine.evaluateObservationValue(5.2, refRange);
    expect(res.rangeType).toBe(ReferenceRangeType.NORMAL);
    expect(res.isAbnormal).toBe(false);
    expect(res.isCritical).toBe(false);
  });

  it("evaluates value above high reference threshold", () => {
    const res = ClinicalKnowledgeEngine.evaluateObservationValue(6.5, refRange);
    expect(res.rangeType).toBe(ReferenceRangeType.HIGH_RISK);
    expect(res.isAbnormal).toBe(true);
  });

  it("evaluates critical high value", () => {
    const res = ClinicalKnowledgeEngine.evaluateObservationValue(9.5, refRange);
    expect(res.rangeType).toBe(ReferenceRangeType.CRITICAL);
    expect(res.isCritical).toBe(true);
  });
});
