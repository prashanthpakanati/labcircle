// apps/web/lib/integration/components/WebhookTester.tsx

import React, { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { WebhookEngine } from "../utils/WebhookEngine";

interface WebhookTesterProps {
  secretKey: string;
  targetUrl: string;
}

export default function WebhookTester({ secretKey, targetUrl }: WebhookTesterProps) {
  const [payload, setPayload] = useState('{\n  "event": "BookingConfirmed",\n  "bookingId": "B-100"\n}');
  const [deliveryResult, setDeliveryResult] = useState<string | null>(null);

  const handleTestDelivery = () => {
    const signature = WebhookEngine.generateSignature(secretKey, payload);
    setDeliveryResult(`Success 200 OK. HMAC Signature: ${signature}`);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3 max-w-md">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Webhook Delivery Simulator</h4>
        <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
          HMAC-SHA256
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <div><span className="font-semibold text-slate-700">Target Endpoint:</span> {targetUrl}</div>
        <div>
          <label className="font-semibold text-slate-700 block mb-1">Payload JSON:</label>
          <textarea
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            rows={3}
            className="w-full font-mono text-[11px] p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <button
        onClick={handleTestDelivery}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors w-full justify-center"
      >
        <Send className="h-3.5 w-3.5" /> Simulate Delivery
      </button>

      {deliveryResult && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 font-mono flex items-start gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>{deliveryResult}</div>
        </div>
      )}
    </div>
  );
}
