// apps/web/lib/providerAvailability/components/ServiceCategoryBookingFlow.tsx

"use client";

import React, { useState } from "react";
import { ServiceCategory } from "../models/enums";
import { ServiceBookingPolicyEngine } from "../utils/ServiceBookingPolicyEngine";
import CenterVisitDatePicker from "./CenterVisitDatePicker";
import HomeCollectionSlotPicker from "./HomeCollectionSlotPicker";
import ExpressCollectionCard from "./ExpressCollectionCard";
import ErrorState from "./ErrorState";
import { useAvailabilityMutations } from "../hooks/useAvailability";
import { DayOfWeek } from "../models/enums";
import { TechnicianTimeSlot } from "../models/types";

interface ServiceCategoryBookingFlowProps {
  serviceCategory: ServiceCategory;
  userId: string;
  // Radiology props
  providerLocationId?: string;
  centerName?: string;
  address?: string;
  workingDays?: DayOfWeek[];
  openTime?: string;
  closeTime?: string;
  holidays?: string[];
  dailyCapacity?: number;
  // Lab Test props
  pincode?: string;
  availableHomeSlots?: TechnicianTimeSlot[];
  isExpressEligible?: boolean;
}

/**
 * ServiceCategoryBookingFlow
 * ---------------------------
 * Container component enforcing the Service Category Booking Policy:
 *  - LAB_TEST: Renders Scheduled Home Collection or ⚡ LabCircle Express. Hides provider selection.
 *  - RADIOLOGY: Renders Imaging Center Selection & Visit Date Picker (Date Only).
 */
export default function ServiceCategoryBookingFlow({
  serviceCategory,
  userId,
  providerLocationId,
  centerName = "Diagnostic Imaging Center",
  address = "Corporate Network Branch",
  workingDays = [DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday, DayOfWeek.Thursday, DayOfWeek.Friday, DayOfWeek.Saturday],
  openTime = "08:00",
  closeTime = "20:00",
  holidays = [],
  dailyCapacity = 200,
  pincode = "500001",
  availableHomeSlots = [
    { slotId: "07:00-08:00", startTime: "07:00", endTime: "08:00", capacity: 5, bookedCount: 1 },
    { slotId: "08:00-09:00", startTime: "08:00", endTime: "09:00", capacity: 5, bookedCount: 2 },
    { slotId: "09:00-10:00", startTime: "09:00", endTime: "10:00", capacity: 5, bookedCount: 0 },
  ],
  isExpressEligible = true,
}: ServiceCategoryBookingFlowProps) {
  const policy = ServiceBookingPolicyEngine.getPolicy(serviceCategory);
  const { createBookingIntent, error } = useAvailabilityMutations();

  const [bookingMode, setBookingMode] = useState<"SCHEDULED" | "EXPRESS">("SCHEDULED");
  const [confirmedIntentId, setConfirmedIntentId] = useState<string | null>(null);

  const handleCenterVisitDateSelect = async (dateStr: string) => {
    if (!providerLocationId) return;
    const intent = await createBookingIntent(
      ServiceCategory.RADIOLOGY,
      dateStr,
      { providerLocationId },
      userId
    );
    if (intent) {
      setConfirmedIntentId(intent.id);
    }
  };

  const handleHomeSlotSelect = async (slotId: string) => {
    const todayStr = new Date().toISOString().split("T")[0];
    const intent = await createBookingIntent(
      ServiceCategory.LAB_TEST,
      todayStr,
      { timeSlotId: slotId, pincode },
      userId
    );
    if (intent) {
      setConfirmedIntentId(intent.id);
    }
  };

  const handleExpressSelect = async () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const intent = await createBookingIntent(
      ServiceCategory.LAB_TEST,
      todayStr,
      { pincode, isExpress: true },
      userId
    );
    if (intent) {
      setConfirmedIntentId(intent.id);
    }
  };

  if (confirmedIntentId) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center space-y-2 max-w-md mx-auto">
        <h3 className="text-base font-bold text-emerald-900">Booking Confirmed!</h3>
        <p className="text-xs text-emerald-700">Booking ID: <span className="font-mono font-bold">{confirmedIntentId}</span></p>
        <p className="text-[11px] text-emerald-600">
          {serviceCategory === ServiceCategory.RADIOLOGY
            ? "Please visit the center anytime during working hours on your visit date."
            : "A LabCircle phlebotomist has been automatically assigned."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && <ErrorState message={error} />}

      {/* RADIOLOGY FLOW */}
      {policy.category === ServiceCategory.RADIOLOGY && (
        <CenterVisitDatePicker
          centerName={centerName}
          address={address}
          workingDays={workingDays}
          openTime={openTime}
          closeTime={closeTime}
          holidays={holidays}
          dailyCapacity={dailyCapacity}
          onDateSelect={handleCenterVisitDateSelect}
        />
      )}

      {/* LAB TEST FLOW */}
      {policy.category === ServiceCategory.LAB_TEST && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setBookingMode("SCHEDULED")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                bookingMode === "SCHEDULED"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Scheduled Home Collection
            </button>
            <button
              onClick={() => setBookingMode("EXPRESS")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                bookingMode === "EXPRESS"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              ⚡ LabCircle Express (60 Min)
            </button>
          </div>

          {bookingMode === "EXPRESS" ? (
            <ExpressCollectionCard
              isAvailable={isExpressEligible}
              pincode={pincode}
              onSelectExpress={handleExpressSelect}
              onFallbackToScheduled={() => setBookingMode("SCHEDULED")}
            />
          ) : (
            <HomeCollectionSlotPicker
              dateStr={new Date().toISOString().split("T")[0]}
              pincode={pincode}
              availableSlots={availableHomeSlots}
              onSlotSelect={handleHomeSlotSelect}
            />
          )}
        </div>
      )}
    </div>
  );
}
