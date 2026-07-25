// apps/web/lib/operations/utils/AlertEngine.ts

import { AlertSeverity, AlertType, SLAStatus, RegionZone } from "../models/enums";
import { OperationalAlert, SLARecord } from "../models/types";
import { Timestamp } from "firebase/firestore";

export class AlertEngine {
  /**
   * Generates operational alerts from active SLA records, phlebotomist telemetry, and partner loads.
   */
  static generateAlerts(
    slaRecords: SLARecord[],
    offlinePhlebCount: number,
    overloadedPartnerNames: string[],
    region: RegionZone
  ): OperationalAlert[] {
    const alerts: OperationalAlert[] = [];
    const now = { seconds: Math.floor(Date.now() / 1000) } as Timestamp;

    // 1. SLA Breach Alerts
    const breaches = slaRecords.filter((r) => r.status === SLAStatus.RED);
    if (breaches.length > 0) {
      alerts.push({
        id: `alert-sla-${Date.now()}`,
        type: AlertType.SLA_BREACH,
        severity: AlertSeverity.CRITICAL,
        title: `${breaches.length} SLA Breaches Detected`,
        message: `${breaches.length} fulfillment task(s) in ${region} have breached SLA thresholds.`,
        region,
        timestamp: now,
        acknowledged: false,
      });
    }

    // 2. Offline Technician Alerts
    if (offlinePhlebCount > 0) {
      alerts.push({
        id: `alert-phleb-${Date.now()}`,
        type: AlertType.TECHNICIAN_OFFLINE,
        severity: AlertSeverity.WARNING,
        title: `${offlinePhlebCount} Technicians Offline`,
        message: `${offlinePhlebCount} scheduled phlebotomists in ${region} are currently offline or unresponsive.`,
        region,
        timestamp: now,
        acknowledged: false,
      });
    }

    // 3. Partner Capacity Overload Alerts
    if (overloadedPartnerNames.length > 0) {
      alerts.push({
        id: `alert-partner-${Date.now()}`,
        type: AlertType.PARTNER_CAPACITY_OVERLOAD,
        severity: AlertSeverity.WARNING,
        title: `Partner Overload Warning`,
        message: `Processing partners [${overloadedPartnerNames.join(", ")}] have exceeded 90% capacity.`,
        region,
        timestamp: now,
        acknowledged: false,
      });
    }

    return alerts;
  }
}
