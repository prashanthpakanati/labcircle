// apps/web/lib/providerAvailability/components/CenterVisitDatePicker.tsx

"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, MapPin, Building2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { DayOfWeek } from "../models/enums";
import { validateCenterVisitBookingDate } from "../validation/validateImagingCenterAvailability";

interface CenterVisitDatePickerProps {
  centerName: string;
  address: string;
  workingDays: DayOfWeek[];
  openTime: string;
  closeTime: string;
  holidays: string[];
  dailyCapacity: number;
  currentBookingsCount?: number;
  onDateSelect: (dateStr: string) => void;
}

/**
 * UI Component for Radiology / Center Visits.
 * Allows date-only selection. Does NOT present appointment time slots.
 * Displays working hours, address, holiday warnings, and remaining daily capacity.
 */
export default function CenterVisitDatePicker({
  centerName,
  address,
  workingDays,
  openTime,
  closeTime,
  holidays,
  dailyCapacity,
  currentBookingsCount = 0,
  onDateSelect,
}: CenterVisitDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSelectedDate(val);

    if (!val) {
      setValidationError(null);
      return;
    }

    const check = validateCenterVisitBookingDate(
      workingDays,
      holidays,
      dailyCapacity,
      val,
      currentBookingsCount
    );

    if (!check.isValid) {
      setValidationError(Object.values(check.errors)[0] ?? "Invalid date");
    } else {
      setValidationError(null);
      onDateSelect(val);
    }
  };

  const formattedWorkingDays = workingDays.join(", ");

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4 max-w-xl">
      {/* Header Info */}
      <div className="space-y-1 border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Building2 className="h-4 w-4 text-indigo-600" />
          {centerName}
        </h3>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          {address}
        </p>
      </div>

      {/* Working Hours Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <Clock className="h-3.5 w-3.5 text-indigo-600" />
          Working Hours: {openTime} – {closeTime}
        </div>
        <p className="text-[11px] text-muted-foreground">
          Open: <span className="font-semibold text-slate-700">{formattedWorkingDays}</span>
        </p>
        <p className="text-[10px] text-slate-500 italic pt-0.5">
          Please visit the imaging center anytime during working hours on your selected date.
        </p>
      </div>

      {/* Date Picker Input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-700" htmlFor="center-visit-date">
          Choose Visit Date <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <input
            id="center-visit-date"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={new Date().toISOString().split("T")[0]}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
          />
          <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>

        {validationError && (
          <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg p-2 mt-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {selectedDate && !validationError && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg p-2 mt-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>Date valid! Visit anytime between {openTime} and {closeTime}.</span>
          </div>
        )}
      </div>
    </div>
  );
}
