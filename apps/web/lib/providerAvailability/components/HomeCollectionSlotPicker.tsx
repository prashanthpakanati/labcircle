// apps/web/lib/providerAvailability/components/HomeCollectionSlotPicker.tsx

"use client";

import React, { useState } from "react";
import { Clock, CheckCircle2, UserCheck, MapPin } from "lucide-react";
import { TechnicianTimeSlot } from "../models/types";

interface HomeCollectionSlotPickerProps {
  dateStr: string;
  pincode: string;
  availableSlots: TechnicianTimeSlot[];
  onSlotSelect: (slotId: string) => void;
}

/**
 * UI Component for Lab Test Scheduled Home Collection.
 * Displays available time slots with phlebotomist capacity indicators.
 */
export default function HomeCollectionSlotPicker({
  dateStr,
  pincode,
  availableSlots,
  onSlotSelect,
}: HomeCollectionSlotPickerProps) {
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");

  const handleSelect = (slotId: string) => {
    setSelectedSlotId(slotId);
    onSlotSelect(slotId);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4 max-w-xl">
      <div className="space-y-1 border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-indigo-600" />
          Select Home Collection Time Slot
        </h3>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          Pincode: <span className="font-semibold text-slate-700">{pincode}</span> · Date: <span className="font-semibold text-slate-700">{dateStr}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {availableSlots.map((slot) => {
          const isFull = slot.bookedCount >= slot.capacity;
          const isSelected = selectedSlotId === slot.slotId;

          return (
            <button
              key={slot.slotId}
              disabled={isFull}
              onClick={() => handleSelect(slot.slotId)}
              className={`p-3 rounded-lg border text-left transition-all relative ${
                isFull
                  ? "bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed"
                  : isSelected
                  ? "bg-indigo-50 border-indigo-600 ring-2 ring-indigo-200"
                  : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900">{slot.startTime} – {slot.endTime}</span>
                {isSelected && <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                <UserCheck className="h-3 w-3 text-slate-400" />
                {isFull ? "Slot Full" : `Phlebotomist Available (${slot.capacity - slot.bookedCount} left)`}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
