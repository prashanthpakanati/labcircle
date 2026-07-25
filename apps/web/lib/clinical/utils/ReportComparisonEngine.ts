// apps/web/lib/clinical/utils/ReportComparisonEngine.ts

import { ClinicalReport, ClinicalObservation } from "../models/types";

export interface ObservationDelta {
  testCode: string;
  testName: string;
  previousValue: number | string;
  currentValue: number | string;
  unit: string;
  percentageDelta?: number | null;
  changeStatus: "INCREASED" | "DECREASED" | "UNCHANGED";
}

export class ReportComparisonEngine {
  /**
   * Compares two clinical report snapshots side by side and calculates observation deltas.
   */
  static compareReports(previousReport: ClinicalReport, currentReport: ClinicalReport): ObservationDelta[] {
    const prevMap = new Map<string, ClinicalObservation>();
    previousReport.observations.forEach((o) => prevMap.set(o.testCode, o));

    const deltas: ObservationDelta[] = [];

    currentReport.observations.forEach((currObs) => {
      const prevObs = prevMap.get(currObs.testCode);
      if (prevObs) {
        let percentageDelta: number | null = null;
        let changeStatus: "INCREASED" | "DECREASED" | "UNCHANGED" = "UNCHANGED";

        if (typeof currObs.value === "number" && typeof prevObs.value === "number") {
          const diff = currObs.value - prevObs.value;
          percentageDelta = Math.round((diff / prevObs.value) * 100);

          if (diff > 0) changeStatus = "INCREASED";
          if (diff < 0) changeStatus = "DECREASED";
        }

        deltas.push({
          testCode: currObs.testCode,
          testName: currObs.testName,
          previousValue: prevObs.value,
          currentValue: currObs.value,
          unit: currObs.unit,
          percentageDelta,
          changeStatus,
        });
      }
    });

    return deltas;
  }
}
