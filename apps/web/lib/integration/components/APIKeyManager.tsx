// apps/web/lib/integration/components/APIKeyManager.tsx

import React from "react";
import { Key } from "lucide-react";
import { APIKey } from "../models/types";

interface APIKeyManagerProps {
  apiKeys: APIKey[];
  onCreateKey?: () => void;
}

export default function APIKeyManager({ apiKeys }: APIKeyManagerProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 max-w-md">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
          <Key className="h-4 w-4 text-indigo-600" />
          <h4 className="uppercase tracking-wider">Developer API Keys</h4>
        </div>
        <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
          Gateway Secured
        </span>
      </div>

      <div className="space-y-2">
        {!apiKeys || apiKeys.length === 0 ? (
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-center text-xs text-slate-500">
            No active API keys found for this project.
          </div>
        ) : (
          apiKeys.map((k) => (
            <div key={k.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-900">{k.keyPrefix}••••••••</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  {k.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Scopes: {k.scopes.join(", ")}</span>
                <span>Limit: {k.rateLimitPerMin}/min</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
