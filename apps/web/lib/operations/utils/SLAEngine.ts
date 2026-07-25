// apps/web/lib/operations/utils/SLAEngine.ts

import { SLAStatus } from "../models/enums";
import { SLARecord } from "../models/types";

export interface StageSLASpec {
  stageName: string;
  targetMins: number;
  warningThresholdMins: number;
}

export class SLAEngine {
  private static readonly DEFAULT_STAGE_SPECS: Record<string, StageSLASpec> = {
    DISPATCH: { stageName: "DISPATCH", targetMins: 15, warningThresholdMins: 10 },
    COLLECTION: { stageName: "COLLECTION", targetMins: 60, warningThresholdMins: 45 },
    TRANSIT: { stageName: "TRANSIT", targetMins: 90, warningThresholdMins: 75 },
    PROCESSING: { stageName: "PROCESSING", targetMins: 360, warningThresholdMins: 300 },
    REPORT_DELIVERY: { stageName: "REPORT_DELIVERY", targetMins: 720, warningThresholdMins: 600 },
  };

  /**
   * Calculates SLA Status (GREEN, YELLOW, RED) based on elapsed time vs stage threshold spec.
   */
  static evaluateStageSLA(stage: string, elapsedMins: number, customTargetMins?: number): SLAStatus {
    const spec = this.DEFAULT_STAGE_SPECS[stage] ?? {
      stageName: stage,
      targetMins: customTargetMins ?? 60,
      warningThresholdMins: (customTargetMins ?? 60) * 0.75,
    };

    const target = customTargetMins ?? spec.targetMins;
    const warning = customTargetMins ? customTargetMins * 0.75 : spec.warningThresholdMins;

    if (elapsedMins >= target) {
      return SLAStatus.RED;
    }
    if (elapsedMins >= warning) {
      return SLAStatus.YELLOW;
    }
    return SLAStatus.GREEN;
  }

  /**
   * Evaluates a collection of active SLA records and identifies overdue cases.
   */
  static identifyBreaches(records: SLARecord[]): SLARecord[] {
    return records.filter((r) => r.status === SLAStatus.RED);
  }
}
