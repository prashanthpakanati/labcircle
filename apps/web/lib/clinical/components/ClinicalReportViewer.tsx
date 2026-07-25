// apps/web/lib/clinical/components/ClinicalReportViewer.tsx

import React from "react";
import { FileText, ShieldCheck, AlertCircle, Calendar, User, Award } from "lucide-react";
import { ClinicalReport } from "../models/types";
import { ReportStatus } from "../models/enums";

interface ClinicalReportViewerProps {
  report: ClinicalReport;
}

export default function ClinicalReportViewer({ report }: ClinicalReportViewerProps) {
  let statusBadge = "bg-blue-50 text-blue-700 border-blue-200";
  if (report.status === ReportStatus.PATHOLOGIST_APPROVED || report.status === ReportStatus.PUBLISHED || report.status === ReportStatus.DELIVERED) {
    statusBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-indigo-600" />
          <div>
            <h3 className="text-base font-bold text-slate-900">Diagnostic Clinical Report</h3>
            <p className="text-xs text-muted-foreground">Report ID: {report.id} (v{report.version})</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge}`}>
          {report.status.replace(/_/g, " ")}
        </span>
      </div>

      {/* Critical Alert Warning */}
      {report.hasCriticalValue && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-center gap-3 text-rose-900">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold">CRITICAL OBSERVATION DETECTED:</span> One or more diagnostic parameters exceed normal reference bounds. Prompt physician consultation recommended.
          </div>
        </div>
      )}

      {/* Patient & Booking Metadata */}
      <div className="grid grid-cols-3 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs">
        <div>
          <span className="text-slate-500 block font-medium">Patient Name</span>
          <span className="font-bold text-slate-900 flex items-center gap-1">
            <User className="h-3.5 w-3.5 text-slate-400" /> {report.patientName} ({report.patientAge}y, {report.patientGender})
          </span>
        </div>

        <div>
          <span className="text-slate-500 block font-medium">Service Category</span>
          <span className="font-bold text-slate-900">{report.serviceCategory}</span>
        </div>

        <div>
          <span className="text-slate-500 block font-medium">Booking Reference</span>
          <span className="font-bold text-slate-900 flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-slate-400" /> {report.bookingId}
          </span>
        </div>
      </div>

      {/* Observations Table */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Clinical Observations</h4>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Test Parameter</th>
                <th className="py-2.5 px-3">LOINC</th>
                <th className="py-2.5 px-3 text-right">Result</th>
                <th className="py-2.5 px-3">Unit</th>
                <th className="py-2.5 px-3">Reference Range</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {report.observations.map((obs) => {
                let rowBg = "";
                let statusBadge = "bg-slate-100 text-slate-700";

                if (obs.isCritical) {
                  rowBg = "bg-rose-50/50 font-semibold";
                  statusBadge = "bg-rose-100 text-rose-800 font-bold";
                } else if (obs.isAbnormal) {
                  rowBg = "bg-amber-50/50 font-medium";
                  statusBadge = "bg-amber-100 text-amber-800 font-semibold";
                } else {
                  statusBadge = "bg-emerald-100 text-emerald-800";
                }

                return (
                  <tr key={obs.id} className={rowBg}>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{obs.testName}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{obs.loincCode || "N/A"}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">{obs.value}</td>
                    <td className="py-2.5 px-3 text-slate-600">{obs.unit}</td>
                    <td className="py-2.5 px-3 text-slate-600">{obs.referenceRangeText}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${statusBadge}`}>
                        {obs.rangeType}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pathologist Digital Signature */}
      {report.pathologistSignature ? (
        <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs">
              <ShieldCheck className="h-4 w-4 text-indigo-600" /> Pathologist Digital Signature Verified
            </div>
            <p className="text-[11px] text-indigo-700 font-medium">
              Signed by Dr. {report.pathologistSignature.pathologistName} (Lic #{report.pathologistSignature.medicalLicenseNumber})
            </p>
            <p className="text-[10px] text-indigo-500 font-mono">
              Hash: {report.pathologistSignature.digitalSignatureHash}
            </p>
          </div>
          <Award className="h-8 w-8 text-indigo-400" />
        </div>
      ) : (
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center text-xs text-muted-foreground">
          Pending pathologist review and digital signature.
        </div>
      )}
    </div>
  );
}
