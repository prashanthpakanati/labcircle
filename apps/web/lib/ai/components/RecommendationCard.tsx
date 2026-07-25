// apps/web/lib/ai/components/RecommendationCard.tsx

import React from "react";
import { Sparkles, CheckCircle, XCircle } from "lucide-react";
import { AIRecommendation } from "../models/types";
import { RecommendationStatus } from "../models/enums";

interface RecommendationCardProps {
  recommendation: AIRecommendation;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export default function RecommendationCard({ recommendation, onApprove, onReject }: RecommendationCardProps) {
  const isPending = recommendation.status === RecommendationStatus.PENDING;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3 max-w-md">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
          <Sparkles className="h-4 w-4 text-purple-600" />
          <span>AI Recommendation: {recommendation.type}</span>
        </div>
        <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-full border border-purple-200">
          {recommendation.confidencePercent}% Confidence
        </span>
      </div>

      <div className="text-xs space-y-1 text-slate-700">
        <div><span className="font-semibold text-slate-900">Reasoning:</span> {recommendation.reasoning}</div>
        {recommendation.evidence && recommendation.evidence.length > 0 && (
          <div className="text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700">Evidence:</span> {recommendation.evidence.join(", ")}
          </div>
        )}
      </div>

      {isPending && (
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-2">
          <button
            onClick={() => onReject && onReject(recommendation.id)}
            className="flex items-center gap-1 px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-colors"
          >
            <XCircle className="h-3.5 w-3.5" /> Reject
          </button>
          <button
            onClick={() => onApprove && onApprove(recommendation.id)}
            className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
          >
            <CheckCircle className="h-3.5 w-3.5" /> Approve
          </button>
        </div>
      )}
    </div>
  );
}
