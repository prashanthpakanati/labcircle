// apps/web/lib/clinical/__tests__/stateMachine.test.ts

import { describe, it, expect } from "vitest";
import { ReportStateMachine } from "../utils/ReportStateMachine";
import { ReportStatus } from "../models/enums";

describe("ReportStateMachine", () => {
  it("allows valid report status lifecycle sequence", () => {
    expect(ReportStateMachine.canTransition(ReportStatus.DRAFT, ReportStatus.GENERATED)).toBe(true);
    expect(ReportStateMachine.canTransition(ReportStatus.GENERATED, ReportStatus.UNDER_REVIEW)).toBe(true);
    expect(ReportStateMachine.canTransition(ReportStatus.UNDER_REVIEW, ReportStatus.PATHOLOGIST_APPROVED)).toBe(true);
    expect(ReportStateMachine.canTransition(ReportStatus.PATHOLOGIST_APPROVED, ReportStatus.PUBLISHED)).toBe(true);
    expect(ReportStateMachine.canTransition(ReportStatus.PUBLISHED, ReportStatus.DELIVERED)).toBe(true);
  });

  it("rejects illegal state jumps (DRAFT -> PUBLISHED)", () => {
    expect(ReportStateMachine.canTransition(ReportStatus.DRAFT, ReportStatus.PUBLISHED)).toBe(false);
    expect(() => ReportStateMachine.validateTransition(ReportStatus.DRAFT, ReportStatus.PUBLISHED)).toThrow(
      "Invalid Report State Machine transition"
    );
  });

  it("disallows transition out of terminal ARCHIVED state", () => {
    expect(ReportStateMachine.canTransition(ReportStatus.ARCHIVED, ReportStatus.PUBLISHED)).toBe(false);
  });
});
