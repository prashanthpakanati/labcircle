// apps/web/lib/clinical/utils/ClinicalAlertEngine.ts

import { AlertSeverity, AlertType } from "../models/enums";
import { ClinicalAlert, ClinicalReport } from "../models/types";
import { Timestamp } from "firebase/firestore";

export class ClinicalAlertEngine {
  /**
   * Automatically scans a clinical report for critical lab values and generates clinical alerts.
   */
  static scanReportForAlerts(report: ClinicalReport): ClinicalAlert[] {
    const alerts: ClinicalAlert[] = [];
    const now = { seconds: Math.floor(Date.now() / 1000) } as Timestamp;

    const criticalObs = report.observations.filter((o) => o.isCritical);

    criticalObs.forEach((o) => {
      alerts.push({
        id: `alert-crit-${report.id}-${o.testCode}`,
        reportId: report.id,
        patientId: report.patientId,
        type: AlertType.CRITICAL_VALUE,
        severity: AlertSeverity.CRITICAL,
        title: `CRITICAL VALUE: ${o.testName}`,
        message: `${o.testName} value of ${o.value} ${o.unit} exceeds safety threshold (Reference Range: ${o.referenceRangeText}). Immediate clinical attention recommended.`,
        acknowledged: false,
        createdAt: now,
      });
    });

    return alerts;
  }
}
