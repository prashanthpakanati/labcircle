// apps/web/lib/operations/utils/OperationsCommandCenter.ts

import { RegionZone } from "../models/enums";
import { OperationsCommandCenterState, SLARecord, TechnicianShiftRecord, PartnerPerformanceRecord } from "../models/types";
import { AlertEngine } from "./AlertEngine";
import { OperationsKPIEngine } from "./OperationsKPIEngine";
import { WorkforceCapacityEngine } from "./WorkforceCapacityEngine";
import { PartnerHealthEngine } from "./PartnerHealthEngine";

export class OperationsCommandCenter {
  /**
   * Orchestrates and composes operational state for dashboard widgets.
   * Direct database queries must not be run inside UI components.
   */
  static composeState(
    region: RegionZone,
    activeFulfillmentCount: number,
    pendingAssignmentCount: number,
    samplesInTransitCount: number,
    activePhlebCount: number,
    onlinePartnerCount: number,
    slaRecords: SLARecord[],
    shifts: TechnicianShiftRecord[],
    partnerRecords: PartnerPerformanceRecord[]
  ): OperationsCommandCenterState {
    const kpis = OperationsKPIEngine.computeKPIs(activeFulfillmentCount, slaRecords.filter((r) => r.status === "RED").length, 5);
    const alerts = AlertEngine.generateAlerts(slaRecords, Math.max(0, shifts.length - activePhlebCount), [], region);
    const capacity = WorkforceCapacityEngine.calculateCapacity(shifts);
    const partnerHealth = PartnerHealthEngine.evaluateHealth(partnerRecords);

    return {
      region,
      activeFulfillmentsCount: activeFulfillmentCount,
      pendingAssignmentsCount: pendingAssignmentCount,
      samplesInTransitCount,
      slaBreachesCount: slaRecords.filter((r) => r.status === "RED").length,
      activeTechniciansCount: activePhlebCount,
      onlinePartnersCount: onlinePartnerCount,
      kpis,
      alerts,
      capacity,
      partnerHealth,
    };
  }
}
