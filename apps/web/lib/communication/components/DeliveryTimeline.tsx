// apps/web/lib/communication/components/DeliveryTimeline.tsx

import React from "react";
import { Smartphone, MessageSquare, Mail, Bell } from "lucide-react";
import { CommunicationChannel, CommunicationStatus } from "../models/enums";

interface DeliveryTimelineProps {
  channel: CommunicationChannel;
  status: CommunicationStatus;
  providerName: string;
  recipient: string;
}

export default function DeliveryTimeline({ channel, status, providerName, recipient }: DeliveryTimelineProps) {
  let icon = <Smartphone className="h-4 w-4 text-slate-500" />;
  if (channel === CommunicationChannel.WHATSAPP) icon = <MessageSquare className="h-4 w-4 text-emerald-600" />;
  if (channel === CommunicationChannel.EMAIL) icon = <Mail className="h-4 w-4 text-indigo-600" />;
  if (channel === CommunicationChannel.PUSH || channel === CommunicationChannel.IN_APP) icon = <Bell className="h-4 w-4 text-purple-600" />;

  let badgeColor = "bg-slate-100 text-slate-700";
  if (status === CommunicationStatus.DELIVERED || status === CommunicationStatus.READ) badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === CommunicationStatus.FAILED) badgeColor = "bg-rose-50 text-rose-700 border-rose-200";

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3 max-w-md">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
          {icon}
          <span>{channel} Delivery Status</span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
          {status}
        </span>
      </div>

      <div className="text-xs space-y-1 text-slate-600">
        <div><span className="font-semibold text-slate-800">Recipient:</span> {recipient}</div>
        <div><span className="font-semibold text-slate-800">Provider Adapter:</span> {providerName}</div>
      </div>
    </div>
  );
}
