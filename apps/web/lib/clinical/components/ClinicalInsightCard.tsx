// apps/web/lib/clinical/components/ClinicalInsightCard.tsx

import React from "react";
import { Sparkles, ShieldAlert, HeartPulse, CheckCircle2 } from "lucide-react";
import { IntelligentReportExplanation } from "../utils/ReportIntelligenceEngine";

interface ClinicalInsightCardProps {
  explanation: IntelligentReportExplanation;
}

export default function ClinicalInsightCard({ explanation }: ClinicalInsightCardProps) {
  return (
    <div className="bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 border border-indigo-100 rounded-xl p-5 shadow-sm space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-indigo-100/60 pb-3">
        <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <h4 className="uppercase tracking-wider">AI-Assisted Educational Report Intelligence</h4>
        </div>
        <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
          Educational Context Only
        </span>
      </div>

      <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white/80 p-3 rounded-lg border border-indigo-50">
        {explanation.summary}
      </p>

      {/* Highlights */}
      {explanation.abnormalHighlights.length > 0 && (
        <div className="space-y-1.5">
          <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-600" /> Parameter Insights
          </h5>
          <ul className="space-y-1 text-xs text-slate-600 pl-4 list-disc">
            {explanation.abnormalHighlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Lifestyle Recommendations */}
      {explanation.lifestyleGuidance.length > 0 && (
        <div className="space-y-1.5">
          <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <HeartPulse className="h-3.5 w-3.5 text-rose-500" /> Lifestyle & Preventive Guidance
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {explanation.lifestyleGuidance.map((g, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-100">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{g}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Safety Disclaimer Notice */}
      <div className="text-[10px] text-slate-500 italic bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
        {explanation.safetyNotice}
      </div>
    </div>
  );
}
