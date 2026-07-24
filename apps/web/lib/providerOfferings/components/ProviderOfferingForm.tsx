// apps/web/lib/providerOfferings/components/ProviderOfferingForm.tsx

"use client";

/**
 * Create / Edit form for Provider Offerings.
 * Uses React Hook Form for form state management and validation.
 * All business validation is performed server‑side (service layer); this form
 * only provides basic client‑side UX feedback.
 */

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ProviderOfferingFormData, PriceConfigurationFormData, AvailabilityFormData } from "../models/form";
import { ProviderOfferingStatus } from "../models/enums";

interface ProviderOfferingFormProps {
  /** Initial values for edit mode. Leave undefined for create mode. */
  defaultValues?: Partial<ProviderOfferingFormData>;
  /** Called when the form is submitted with valid data. */
  onSubmit: (data: ProviderOfferingFormData) => Promise<void>;
  /** Indicates whether a submission is in progress. */
  isSubmitting?: boolean;
  /** If provided, shown as a server‑side error message below the submit button. */
  serverError?: string | null;
  /** Label text for the submit button. */
  submitLabel?: string;
}

const DEFAULT_PRICE: PriceConfigurationFormData = { mrp: 0, sellingPrice: 0 };
const DEFAULT_AVAILABILITY: AvailabilityFormData = { enabled: true, onlineBookable: false };

/**
 * Reusable create/edit form for Provider Offerings.
 * Uses React Hook Form – no Formik, no custom form handling.
 */
export default function ProviderOfferingForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  serverError,
  submitLabel = "Save Offering",
}: ProviderOfferingFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProviderOfferingFormData>({
    defaultValues: {
      priceConfiguration: DEFAULT_PRICE,
      availability: DEFAULT_AVAILABILITY,
      displayOrder: 0,
      status: ProviderOfferingStatus.Draft,
      ...defaultValues,
    },
  });

  const watchEnabled = watch("availability.enabled");
  const watchMrp = watch("priceConfiguration.mrp");

  const handleFormSubmit: SubmitHandler<ProviderOfferingFormData> = async (data: ProviderOfferingFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-w-2xl" id="provider-offering-form">
      {/* ── Pricing ─────────────────────────────────────────── */}
      <section className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800">Pricing</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="mrp">
              MRP (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              id="mrp"
              type="number"
              min={0}
              step={1}
              {...register("priceConfiguration.mrp", {
                required: "MRP is required",
                min: { value: 0, message: "MRP must be 0 or greater" },
                valueAsNumber: true,
              })}
              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            />
            {errors.priceConfiguration?.mrp && (
              <p className="text-rose-600 text-[11px] mt-1">{errors.priceConfiguration.mrp.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="sellingPrice">
              Selling Price (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              id="sellingPrice"
              type="number"
              min={0}
              step={1}
              {...register("priceConfiguration.sellingPrice", {
                required: "Selling price is required",
                min: { value: 0, message: "Selling price must be 0 or greater" },
                validate: (v: number) =>
                  Number(v) <= Number(watchMrp) || "Selling price cannot exceed MRP",
                valueAsNumber: true,
              })}
              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            />
            {errors.priceConfiguration?.sellingPrice && (
              <p className="text-rose-600 text-[11px] mt-1">{errors.priceConfiguration.sellingPrice.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="memberPrice">
              Member Price (₹)
            </label>
            <input
              id="memberPrice"
              type="number"
              min={0}
              step={1}
              {...register("priceConfiguration.memberPrice", {
                min: { value: 0, message: "Member price must be 0 or greater" },
                valueAsNumber: true,
              })}
              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            />
            {errors.priceConfiguration?.memberPrice && (
              <p className="text-rose-600 text-[11px] mt-1">{errors.priceConfiguration.memberPrice.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="offerPrice">
              Offer Price (₹)
            </label>
            <input
              id="offerPrice"
              type="number"
              min={0}
              step={1}
              {...register("priceConfiguration.offerPrice", {
                min: { value: 0, message: "Offer price must be 0 or greater" },
                valueAsNumber: true,
              })}
              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            />
            {errors.priceConfiguration?.offerPrice && (
              <p className="text-rose-600 text-[11px] mt-1">{errors.priceConfiguration.offerPrice.message}</p>
            )}
          </div>
        </div>
      </section>

      {/* ── Availability ─────────────────────────────────────── */}
      <section className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-800">Availability</h2>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            id="availability-enabled"
            type="checkbox"
            {...register("availability.enabled")}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400"
          />
          <span className="text-sm text-slate-700">Offering is enabled</span>
        </label>

        <label className={`flex items-center gap-3 ${!watchEnabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}>
          <input
            id="availability-online"
            type="checkbox"
            disabled={!watchEnabled}
            {...register("availability.onlineBookable")}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400"
          />
          <span className="text-sm text-slate-700">Available for online booking</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            id="homeCollectionSupported"
            type="checkbox"
            {...register("homeCollectionSupported")}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400"
          />
          <span className="text-sm text-slate-700">Home collection supported</span>
        </label>
      </section>

      {/* ── Display & Overrides ───────────────────────────────── */}
      <section className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800">Display & Overrides</h2>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="displayNameOverride">
            Display Name Override
          </label>
          <input
            id="displayNameOverride"
            type="text"
            {...register("displayNameOverride")}
            placeholder="Leave blank to use catalog name"
            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="displayOrder">
              Display Order <span className="text-rose-500">*</span>
            </label>
            <input
              id="displayOrder"
              type="number"
              min={0}
              step={1}
              {...register("displayOrder", {
                required: "Display order is required",
                min: { value: 0, message: "Must be 0 or greater" },
                valueAsNumber: true,
              })}
              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            />
            {errors.displayOrder && (
              <p className="text-rose-600 text-[11px] mt-1">{errors.displayOrder.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="reportTat">
              Report TAT Override (hours)
            </label>
            <input
              id="reportTat"
              type="number"
              min={0}
              step={1}
              {...register("reportTatOverrideHours", {
                min: { value: 0, message: "Must be 0 or greater" },
                valueAsNumber: true,
              })}
              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="duration">
              Duration Override (minutes)
            </label>
            <input
              id="duration"
              type="number"
              min={0}
              step={1}
              {...register("durationOverrideMinutes", {
                min: { value: 0, message: "Must be 0 or greater" },
                valueAsNumber: true,
              })}
              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="notes">
            Internal Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            {...register("notes")}
            placeholder="For internal use only"
            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none resize-none"
          />
        </div>
      </section>

      {/* ── Submit ────────────────────────────────────────────── */}
      {serverError && (
        <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-4 py-2">
          {serverError}
        </p>
      )}

      <button
        id="submit-offering"
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-60 shadow-sm"
      >
        {isSubmitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
