// apps/web/lib/fulfillment/components/SampleCollectionForm.tsx

"use client";

import React, { useState } from "react";
import { QrCode, ShieldCheck, Plus, CheckCircle2 } from "lucide-react";
import { SpecimenType, ContainerType } from "../models/enums";
import { useFulfillmentMutations } from "../hooks/useFulfillment";
import ErrorState from "../../providerAvailability/components/ErrorState";

interface SampleCollectionFormProps {
  fulfillmentId: string;
  userId: string;
  onSampleAdded?: () => void;
}

export default function SampleCollectionForm({
  fulfillmentId,
  userId,
  onSampleAdded,
}: SampleCollectionFormProps) {
  const { verifyOtp, addSample, error } = useFulfillmentMutations();

  const [otpInput, setOtpInput] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const [barcode, setBarcode] = useState("");
  const [specimenType, setSpecimenType] = useState<SpecimenType>(SpecimenType.BLOOD);
  const [containerType, setContainerType] = useState<ContainerType>(ContainerType.EDTA_TUBE);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    const ok = await verifyOtp(fulfillmentId, otpInput, userId, "Technician");
    if (ok) {
      setIsOtpVerified(true);
    } else {
      setOtpError("Invalid or expired OTP code.");
    }
  };

  const handleAddSample = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    const sample = await addSample(
      fulfillmentId,
      barcode,
      specimenType,
      containerType,
      userId,
      "Technician"
    );
    if (sample) {
      setBarcode("");
      setSuccessMessage(`Sample barcode ${sample.barcode} successfully recorded!`);
      onSampleAdded?.();
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-5 max-w-lg">
      {error && <ErrorState message={error} />}

      {/* STEP 1: OTP VERIFICATION */}
      {!isOtpVerified ? (
        <form onSubmit={handleVerifyOtp} className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-2">
            <ShieldCheck className="h-4 w-4 text-indigo-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Patient OTP Verification</h4>
          </div>

          <p className="text-xs text-muted-foreground">
            Enter 4-digit verification OTP provided by patient at doorstep.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              maxLength={4}
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              placeholder="4-Digit OTP"
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-center tracking-widest w-36 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
            >
              Verify OTP
            </button>
          </div>

          {otpError && <p className="text-xs text-rose-600 font-medium">{otpError}</p>}
        </form>
      ) : (
        /* STEP 2: SPECIMEN SAMPLE TUBE COLLECTION */
        <form onSubmit={handleAddSample} className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider">OTP Verified — Record Samples</h4>
            </div>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              Doorstep Verified
            </span>
          </div>

          {successMessage && (
            <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg p-2 font-medium">
              {successMessage}
            </p>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700" htmlFor="barcode">
              Scan / Enter Sample Barcode <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="barcode"
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="e.g. LAB-EDTA-998822"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-indigo-300 focus:outline-none"
              />
              <QrCode className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700" htmlFor="specimen-type">
                Specimen Type
              </label>
              <select
                id="specimen-type"
                value={specimenType}
                onChange={(e) => setSpecimenType(e.target.value as SpecimenType)}
                className="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:ring-2 focus:ring-indigo-300 focus:outline-none"
              >
                {Object.values(SpecimenType).map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700" htmlFor="container-type">
                Container Type
              </label>
              <select
                id="container-type"
                value={containerType}
                onChange={(e) => setContainerType(e.target.value as ContainerType)}
                className="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:ring-2 focus:ring-indigo-300 focus:outline-none"
              >
                {Object.values(ContainerType).map((ct) => (
                  <option key={ct} value={ct}>
                    {ct.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <Plus className="h-4 w-4" /> Record Sample Container
          </button>
        </form>
      )}
    </div>
  );
}
