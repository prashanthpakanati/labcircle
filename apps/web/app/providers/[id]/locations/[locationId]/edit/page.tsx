// apps/web/app/providers/[id]/locations/[locationId]/edit/page.tsx

"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProvider } from "../../../../../../lib/providers/hooks/useProvider";
import { useProviderLocation } from "../../../../../../lib/providers/hooks/useProviderLocation";
import { ProviderRegistryService } from "../../../../../../lib/providers/services/ProviderRegistryService";
import { ProviderStatus } from "../../../../../../lib/providers/models/enums";
import { ProviderLocationFormData } from "../../../../../../lib/providers/models/form";
import { useCurrentUser } from "../../../../../../src/lib/auth/hooks";
import LoadingSkeleton from "../../../../../../lib/providers/components/LoadingSkeleton";
import ErrorState from "../../../../../../lib/providers/components/ErrorState";
import { ArrowLeft, Check, AlertCircle, Plus, Trash2 } from "lucide-react";
import { AccreditationRecord, OperatingHours } from "../../../../../../lib/providers/models/types";

interface EditLocationPageProps {
  params: Promise<{ id: string; locationId: string }>;
}

export default function EditLocationPage(props: EditLocationPageProps) {
  const params = use(props.params);
  const providerId = params.id;
  const locationId = params.locationId;
  const router = useRouter();
  const user = useCurrentUser();
  const userId = user?.uid || "system_operator";

  // Data fetching hooks
  const { data: provider, loading: providerLoading, error: providerError } = useProvider(providerId);
  const { data: location, loading: locationLoading, error: locationError, refetch: refetchLocation } = useProviderLocation(locationId);

  // Form states
  const [displayName, setDisplayName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [latitude, setLatitude] = useState(17.3850);
  const [longitude, setLongitude] = useState(78.4867);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<ProviderStatus>(ProviderStatus.Active);

  // Accessibility checkbox states
  const [parking, setParking] = useState(false);
  const [wheelchairAccess, setWheelchairAccess] = useState(false);
  const [homeCollectionAvailable, setHomeCollectionAvailable] = useState(false);

  // Operating Hours schedule state
  const [operatingHours, setOperatingHours] = useState<OperatingHours>({
    monday: { isOpen: true, slots: [{ open: "09:00", close: "18:00" }] },
    tuesday: { isOpen: true, slots: [{ open: "09:00", close: "18:00" }] },
    wednesday: { isOpen: true, slots: [{ open: "09:00", close: "18:00" }] },
    thursday: { isOpen: true, slots: [{ open: "09:00", close: "18:00" }] },
    friday: { isOpen: true, slots: [{ open: "09:00", close: "18:00" }] },
    saturday: { isOpen: true, slots: [{ open: "09:00", close: "17:00" }] },
    sunday: { isOpen: false, slots: [] },
  });

  // Accreditations list state
  const [accreditations, setAccreditations] = useState<AccreditationRecord[]>([]);
  const [newAccType, setNewAccType] = useState("NABL");
  const [newAccCertNo, setNewAccCertNo] = useState("");
  const [newAccIssuer, setNewAccIssuer] = useState("");
  const [newAccIssuedAt, setNewAccIssuedAt] = useState("");
  const [newAccExpiresAt, setNewAccExpiresAt] = useState("");

  // UI States
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pre-populate fields on data load
  useEffect(() => {
    if (location) {
      setDisplayName(location.displayName);
      setStatus(location.status);
      setParking(location.parking);
      setWheelchairAccess(location.wheelchairAccess);
      setHomeCollectionAvailable(location.homeCollectionAvailable);

      if (location.address) {
        setStreetAddress(location.address.streetAddress || "");
        setArea(location.address.area || "");
        setCity(location.address.city || "");
        setState(location.address.state || "");
        setPostalCode(location.address.postalCode || "");
      }

      setLatitude(location.latitude ?? 0);
      setLongitude(location.longitude ?? 0);

      if (location.contact) {
        setPhone(location.contact.phone || "");
        setEmail(location.contact.email || "");
      }

      if (location.operatingHours) {
        setOperatingHours(location.operatingHours);
      }

      if (location.accreditations) {
        setAccreditations(location.accreditations);
      }
    }
  }, [location]);

  const handleAddAccreditation = () => {
    if (!newAccCertNo || !newAccIssuer || !newAccIssuedAt || !newAccExpiresAt) {
      alert("Please fill in all accreditation certification details.");
      return;
    }
    const record: AccreditationRecord = {
      type: newAccType,
      certificateNumber: newAccCertNo.trim(),
      issuedBy: newAccIssuer.trim(),
      issuedAt: newAccIssuedAt,
      expiresAt: newAccExpiresAt,
      verificationStatus: "Pending",
    };
    setAccreditations((prev) => [...prev, record]);
    setNewAccCertNo("");
    setNewAccIssuer("");
    setNewAccIssuedAt("");
    setNewAccExpiresAt("");
  };

  const handleRemoveAccreditation = (index: number) => {
    setAccreditations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDayToggle = (day: keyof OperatingHours) => {
    setOperatingHours((prev: OperatingHours) => {
      const schedule = prev[day];
      return {
        ...prev,
        [day]: {
          isOpen: !schedule.isOpen,
          slots: !schedule.isOpen ? [{ open: "09:00", close: "18:00" }] : [],
        },
      };
    });
  };

  const handleTimeChange = (day: keyof OperatingHours, slotIdx: number, field: "open" | "close", val: string) => {
    setOperatingHours((prev: OperatingHours) => {
      const schedule = prev[day];
      const slots = [...schedule.slots];
      slots[slotIdx] = {
        ...slots[slotIdx],
        [field]: val,
      };
      return {
        ...prev,
        [day]: {
          ...schedule,
          slots,
        },
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return;
    setSubmitting(true);
    setValidationErrors({});
    setSubmitError(null);

    const formData: Partial<ProviderLocationFormData> = {
      displayName: displayName.trim(),
      address: {
        streetAddress: streetAddress.trim(),
        area: area.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: "India",
      },
      city: city.trim(),
      state: state.trim(),
      country: "India",
      postalCode: postalCode.trim(),
      latitude,
      longitude,
      contact: {
        phone: phone.trim(),
        email: email.trim(),
      },
      operatingHours,
      accreditations,
      homeCollectionAvailable,
      status,
    };

    try {
      const service = new ProviderRegistryService();
      await service.updateLocation(locationId, formData, userId);
      router.push(`/providers/${providerId}/locations/${locationId}`);
    } catch (err: unknown) {
      const errorObj = err as Error;
      if (errorObj.message && errorObj.message.startsWith("Location validation failed:")) {
        try {
          const rawErrStr = errorObj.message.replace("Location validation failed: ", "");
          const parsedErrors = JSON.parse(rawErrStr);
          setValidationErrors(parsedErrors);
        } catch {
          setSubmitError(errorObj.message);
        }
      } else {
        setSubmitError(errorObj.message || "An unexpected database write error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (providerLoading || locationLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <LoadingSkeleton />
      </div>
    );
  }

  if (providerError || locationError || !provider || !location) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <ErrorState error={providerError || locationError || new Error("Record not found")} onRetry={refetchLocation} />
      </div>
    );
  }

  const days: { key: keyof OperatingHours; label: string }[] = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Link
        href={`/providers/${providerId}/locations/${locationId}`}
        className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5 mr-1" />
        Back to Branch Details view
      </Link>

      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Edit Branch Location</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Update the physical address, operating schedule, and credentials for {location.displayName}.
        </p>
      </div>

      {submitError && (
        <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-lg text-rose-700 text-xs flex gap-2 items-center">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
        {/* Branch identity info */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1.5">
            Branch Identity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Unique Location Code (Immutable)
              </label>
              <input
                type="text"
                value={location.code}
                disabled
                className="w-full px-3 py-1.5 text-xs border border-slate-200 bg-slate-50 text-slate-500 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Branch Display Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="E.g., Apollo Diagnostics - Indiranagar"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                required
              />
              {validationErrors.displayName && (
                <p className="text-[10px] text-rose-600 mt-1">{validationErrors.displayName}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Branch Operational Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProviderStatus)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                <option value={ProviderStatus.Active}>Active</option>
                <option value={ProviderStatus.Suspended}>Suspended</option>
                <option value={ProviderStatus.Inactive}>Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Branch Address & coordinates */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1.5">
            Physical Address & Location coordinates
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-3">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Street Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="E.g., Flat 101, Indiranagar Double Road"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                required
              />
              {validationErrors["address.streetAddress"] && (
                <p className="text-[10px] text-rose-600 mt-1">{validationErrors["address.streetAddress"]}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Locality / Area <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="E.g., Indiranagar"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                required
              />
              {validationErrors["address.area"] && (
                <p className="text-[10px] text-rose-600 mt-1">{validationErrors["address.area"]}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                City <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="E.g., Bengaluru"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                required
              />
              {validationErrors["address.city"] && (
                <p className="text-[10px] text-rose-600 mt-1">{validationErrors["address.city"]}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                State <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="E.g., Karnataka"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                required
              />
              {validationErrors["address.state"] && (
                <p className="text-[10px] text-rose-600 mt-1">{validationErrors["address.state"]}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Postal Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="E.g., 560038"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                maxLength={6}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                required
              />
              {validationErrors["address.postalCode"] && (
                <p className="text-[10px] text-rose-600 mt-1">{validationErrors["address.postalCode"]}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Geographic Latitude <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.000001"
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 font-mono"
                required
              />
              {validationErrors.latitude && (
                <p className="text-[10px] text-rose-600 mt-1">{validationErrors.latitude}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Geographic Longitude <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.000001"
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 font-mono"
                required
              />
              {validationErrors.longitude && (
                <p className="text-[10px] text-rose-600 mt-1">{validationErrors.longitude}</p>
              )}
            </div>
          </div>
        </div>

        {/* Branch contact details */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1.5">
            Local Contact
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Branch Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="E.g., 08025251234"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                required
              />
              {validationErrors["contact.phone"] && (
                <p className="text-[10px] text-rose-600 mt-1">{validationErrors["contact.phone"]}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Branch Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                placeholder="E.g., indiranagar@apollodiagnostics.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                required
              />
              {validationErrors["contact.email"] && (
                <p className="text-[10px] text-rose-600 mt-1">{validationErrors["contact.email"]}</p>
              )}
            </div>
          </div>
        </div>

        {/* Accessibility & home collections features checkboxes */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1.5">
            Facilities & Capabilities
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={parking}
                onChange={(e) => setParking(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 h-4 w-4"
              />
              On-site Parking available
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={wheelchairAccess}
                onChange={(e) => setWheelchairAccess(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 h-4 w-4"
              />
              Wheelchair accessible entry
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={homeCollectionAvailable}
                onChange={(e) => setHomeCollectionAvailable(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 h-4 w-4"
              />
              Home Blood collection available
            </label>
          </div>
        </div>

        {/* Operating hours schedule block */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1.5">
            Operating Hours schedule
          </h3>

          <div className="space-y-3 bg-slate-50 border border-slate-100 rounded-xl p-4">
            {days.map((day) => {
              const schedule = operatingHours[day.key];
              return (
                <div key={String(day.key)} className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs border-b border-slate-200 pb-2 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 font-semibold text-slate-700 w-24 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schedule?.isOpen || false}
                        onChange={() => handleDayToggle(day.key)}
                        className="rounded border-slate-300 text-indigo-600 h-3.5 w-3.5"
                      />
                      {day.label}
                    </label>
                  </div>

                  {schedule?.isOpen ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="09:00"
                        maxLength={5}
                        value={schedule.slots[0]?.open || ""}
                        onChange={(e) => handleTimeChange(day.key, 0, "open", e.target.value)}
                        className="w-16 px-2 py-1 text-center font-mono border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500"
                      />
                      <span className="text-slate-400">to</span>
                      <input
                        type="text"
                        placeholder="18:00"
                        maxLength={5}
                        value={schedule.slots[0]?.close || ""}
                        onChange={(e) => handleTimeChange(day.key, 0, "close", e.target.value)}
                        className="w-16 px-2 py-1 text-center font-mono border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500"
                      />
                      {validationErrors[`operatingHours.${String(day.key)}.0`] && (
                        <span className="text-[10px] text-rose-600 ml-2">{validationErrors[`operatingHours.${String(day.key)}.0`]}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-rose-600 font-semibold italic">Closed</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Accreditations certification uploads */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1.5">
            Accreditation Certificates
          </h3>

          {/* Current certifications */}
          {accreditations.length > 0 && (
            <div className="space-y-2 bg-slate-50 border border-slate-100 rounded-xl p-4">
              {accreditations.map((acc, index) => (
                <div key={index} className="flex justify-between items-center text-xs bg-white border rounded-lg p-2.5">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span>{acc.type} Certificate</span>
                      <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-amber-50 text-amber-700 rounded-full border">{acc.verificationStatus}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      No: {acc.certificateNumber} | Issued: {acc.issuedAt} | Expires: {acc.expiresAt}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAccreditation(index)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Certification input form */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
            <span className="text-xs font-bold text-slate-800 block">Add Accreditation Certification</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Accreditation Type</label>
                <select
                  value={newAccType}
                  onChange={(e) => setNewAccType(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                >
                  <option value="NABL">NABL (National Accreditation Board for Laboratories)</option>
                  <option value="CAP">CAP (College of American Pathologists)</option>
                  <option value="ISO">ISO Certification</option>
                  <option value="NABH">NABH (Hospitals Accreditation)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Certificate Number</label>
                <input
                  type="text"
                  placeholder="E.g., MC-1234"
                  value={newAccCertNo}
                  onChange={(e) => setNewAccCertNo(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Issued By Authority</label>
                <input
                  type="text"
                  placeholder="E.g., Quality Council of India"
                  value={newAccIssuer}
                  onChange={(e) => setNewAccIssuer(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Issued At</label>
                  <input
                    type="date"
                    value={newAccIssuedAt}
                    onChange={(e) => setNewAccIssuedAt(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Expires At</label>
                  <input
                    type="date"
                    value={newAccExpiresAt}
                    onChange={(e) => setNewAccExpiresAt(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddAccreditation}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Certificate to Branch
            </button>
          </div>
        </div>

        {/* Action controls */}
        <div className="pt-4 border-t border-slate-100 flex gap-3 justify-end">
          <Link
            href={`/providers/${providerId}/locations/${locationId}`}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-lg shadow transition-colors flex items-center gap-1.5"
          >
            {submitting ? "Saving..." : <span className="flex items-center gap-1.5"><Check className="h-4 w-4" /> Save Changes</span>}
          </button>
        </div>
      </form>
    </div>
  );
}
