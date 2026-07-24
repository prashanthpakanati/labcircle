// apps/web/app/providers/new/page.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProviderRegistryService } from "../../../lib/providers/services/ProviderRegistryService";
import { ProviderType, ProviderStatus, VerificationStatus } from "../../../lib/providers/models/enums";
import { ProviderFormData } from "../../../lib/providers/models/form";
import { useCurrentUser } from "../../../src/lib/auth/hooks";
import { ArrowLeft, Check, AlertCircle } from "lucide-react";

export default function RegisterProviderPage() {
  const router = useRouter();
  const user = useCurrentUser();
  const userId = user?.uid || "system_operator";

  // Form states
  const [code, setCode] = useState("");
  const [legalName, setLegalName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [providerType, setProviderType] = useState<ProviderType>(ProviderType.ImagingCenter);
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");

  // Address states
  const [streetAddress, setStreetAddress] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Contact states
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // UI States
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setValidationErrors({});
    setSubmitError(null);

    const formData: ProviderFormData = {
      code: code.trim().toUpperCase(),
      legalName: legalName.trim(),
      brandName: brandName.trim(),
      providerType,
      description: description.trim(),
      corporateAddress: {
        streetAddress: streetAddress.trim(),
        area: area.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: "India",
      },
      corporateContact: {
        phone: phone.trim(),
        email: email.trim(),
      },
      website: website.trim() || undefined,
      gstNumber: gstNumber.trim() || undefined,
      panNumber: panNumber.trim() || undefined,
      status: ProviderStatus.Active,
      verificationStatus: VerificationStatus.Pending,
    };

    try {
      const service = new ProviderRegistryService();
      const created = await service.createProvider(formData, userId);
      router.push(`/providers/${created.id}`);
    } catch (err: unknown) {
      const errorObj = err as Error;
      if (errorObj.message && errorObj.message.startsWith("Provider validation failed:")) {
        try {
          const rawErrStr = errorObj.message.replace("Provider validation failed: ", "");
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

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Link
        href="/providers"
        className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5 mr-1" />
        Back to Registry Catalog
      </Link>

      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Register Corporate Provider</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Establish the legal entity and corporate metadata for a health provider network.
        </p>
      </div>

      {submitError && (
        <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-lg text-rose-700 text-xs flex gap-2 items-center">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
        {/* Basic Corporate Fields */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1.5">
            Corporate Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Unique Registry Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="E.g., PRV-APOLLO"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                required
              />
              {validationErrors.code && (
                <p className="text-[10px] text-rose-600 mt-1">{validationErrors.code}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Provider Specialty Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={providerType}
                onChange={(e) => setProviderType(e.target.value as ProviderType)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                <option value={ProviderType.ImagingCenter}>Imaging Center</option>
                <option value={ProviderType.Laboratory}>Diagnostic Laboratory</option>
                <option value={ProviderType.Hospital}>Hospital</option>
                <option value={ProviderType.Clinic}>Clinic</option>
                <option value={ProviderType.PhlebotomyAgency}>Home Collection Agency</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Brand Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="E.g., Apollo Diagnostics"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                required
              />
              {validationErrors.brandName && (
                <p className="text-[10px] text-rose-600 mt-1">{validationErrors.brandName}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Legal corporate Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="E.g., Apollo Health and Lifestyle Ltd"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                required
              />
              {validationErrors.legalName && (
                <p className="text-[10px] text-rose-600 mt-1">{validationErrors.legalName}</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Description</label>
              <textarea
                placeholder="Brief corporate description or profile summary..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Corporate Address */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1.5">
            Corporate Office Address
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-3">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Street Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="E.g., 8-2-293, Road No 82"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                required
              />
              {validationErrors["corporateAddress.streetAddress"] && (
                <p className="text-[10px] text-rose-600 mt-1">{validationErrors["corporateAddress.streetAddress"]}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Locality / Area <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="E.g., Jubilee Hills"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                required
              />
              {validationErrors["corporateAddress.area"] && (
                <p className="text-[10px] text-rose-600 mt-1">{validationErrors["corporateAddress.area"]}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                City <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="E.g., Hyderabad"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                required
              />
              {validationErrors["corporateAddress.city"] && (
                <p className="text-[10px] text-rose-600 mt-1">{validationErrors["corporateAddress.city"]}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                State <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="E.g., Telangana"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                required
              />
              {validationErrors["corporateAddress.state"] && (
                <p className="text-[10px] text-rose-600 mt-1">{validationErrors["corporateAddress.state"]}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Postal Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="E.g., 500033"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                maxLength={6}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                required
              />
              {validationErrors["corporateAddress.postalCode"] && (
                <p className="text-[10px] text-rose-600 mt-1">{validationErrors["corporateAddress.postalCode"]}</p>
              )}
            </div>
          </div>
        </div>

        {/* Corporate Contacts */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1.5">
            Corporate Contact Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="E.g., 04023600200"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                required
              />
              {validationErrors["corporateContact.phone"] && (
                <p className="text-[10px] text-rose-600 mt-1">{validationErrors["corporateContact.phone"]}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                placeholder="E.g., contact@apollodiagnostics.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                required
              />
              {validationErrors["corporateContact.email"] && (
                <p className="text-[10px] text-rose-600 mt-1">{validationErrors["corporateContact.email"]}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Website URL</label>
              <input
                type="url"
                placeholder="E.g., https://apollodiagnostics.in"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Regulatory/Financial credentials */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1.5">
            Legal & Tax Credentials
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">PAN Number</label>
              <input
                type="text"
                placeholder="E.g., AABCA1234D"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 font-mono uppercase"
              />
              {validationErrors.panNumber && (
                <p className="text-[10px] text-rose-600 mt-1">{validationErrors.panNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">GSTIN Number</label>
              <input
                type="text"
                placeholder="E.g., 36AABCA1234D1ZH"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 font-mono uppercase"
              />
              {validationErrors.gstNumber && (
                <p className="text-[10px] text-rose-600 mt-1">{validationErrors.gstNumber}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 flex gap-3 justify-end">
          <Link
            href="/providers"
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-lg shadow transition-colors flex items-center gap-1.5"
          >
            {submitting ? "Saving..." : <span className="flex items-center gap-1.5"><Check className="h-4 w-4" /> Save Corporate Provider</span>}
          </button>
        </div>
      </form>
    </div>
  );
}
