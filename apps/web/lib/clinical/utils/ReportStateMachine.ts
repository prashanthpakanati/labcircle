// apps/web/lib/clinical/utils/ReportStateMachine.ts

import { ReportStatus } from "../models/enums";

export class ReportStateMachine {
  private static readonly ALLOWED_TRANSITIONS: Record<ReportStatus, ReportStatus[]> = {
    [ReportStatus.DRAFT]: [ReportStatus.GENERATED, ReportStatus.ARCHIVED],
    [ReportStatus.GENERATED]: [ReportStatus.UNDER_REVIEW, ReportStatus.DRAFT],
    [ReportStatus.UNDER_REVIEW]: [ReportStatus.PATHOLOGIST_APPROVED, ReportStatus.DRAFT],
    [ReportStatus.PATHOLOGIST_APPROVED]: [ReportStatus.PUBLISHED, ReportStatus.UNDER_REVIEW],
    [ReportStatus.PUBLISHED]: [ReportStatus.DELIVERED, ReportStatus.PATHOLOGIST_APPROVED],
    [ReportStatus.DELIVERED]: [ReportStatus.ACKNOWLEDGED, ReportStatus.ARCHIVED],
    [ReportStatus.ACKNOWLEDGED]: [ReportStatus.ARCHIVED],
    [ReportStatus.ARCHIVED]: [],
  };

  static canTransition(current: ReportStatus, next: ReportStatus): boolean {
    const allowed = this.ALLOWED_TRANSITIONS[current];
    return allowed ? allowed.includes(next) : false;
  }

  static validateTransition(current: ReportStatus, next: ReportStatus): void {
    if (!this.canTransition(current, next)) {
      throw new Error(`Invalid Report State Machine transition: Cannot transition from '${current}' to '${next}'.`);
    }
  }
}
