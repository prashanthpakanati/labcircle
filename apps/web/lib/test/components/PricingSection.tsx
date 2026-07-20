// apps/web/lib/test/components/PricingSection.tsx

import React from "react";
import { Input } from "@/components/ui/input";

interface PricingSectionProps {
  mrp: number;
  b2bPrice: number;
  labCirclePrice: number;
  errors: Record<string, string>;
  onChange: (field: string, value: string | number | boolean) => void;
}

export default function PricingSection({
  mrp,
  b2bPrice,
  labCirclePrice,
  errors,
  onChange,
}: PricingSectionProps) {
  const handleNumberInput = (field: string, rawVal: string) => {
    const parsed = rawVal === "" ? 0 : parseFloat(rawVal);
    onChange(field, isNaN(parsed) ? 0 : parsed);
  };

  return (
    <div className="space-y-4 border border-border p-4 rounded-lg bg-white">
      <h3 className="text-sm font-semibold text-slate-800 border-b border-border pb-2">
        Pricing Configuration
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* MRP */}
        <div className="space-y-1">
          <label htmlFor="price-mrp" className="text-xs font-medium text-slate-700">
            MRP (₹) <span className="text-destructive">*</span>
          </label>
          <Input
            id="price-mrp"
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 500"
            value={mrp === 0 && errors.mrp ? "" : mrp}
            onChange={(e) => handleNumberInput("mrp", e.target.value)}
            aria-invalid={!!errors.mrp}
          />
          {errors.mrp && <p className="text-xs text-destructive">{errors.mrp}</p>}
        </div>

        {/* B2B Price */}
        <div className="space-y-1">
          <label htmlFor="price-b2b" className="text-xs font-medium text-slate-700">
            B2B Partner Price (₹) <span className="text-destructive">*</span>
          </label>
          <Input
            id="price-b2b"
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 350"
            value={b2bPrice === 0 && errors.b2bPrice ? "" : b2bPrice}
            onChange={(e) => handleNumberInput("b2bPrice", e.target.value)}
            aria-invalid={!!errors.b2bPrice}
          />
          {errors.b2bPrice && <p className="text-xs text-destructive">{errors.b2bPrice}</p>}
        </div>

        {/* LabCircle Price */}
        <div className="space-y-1">
          <label htmlFor="price-labcircle" className="text-xs font-medium text-slate-700">
            LabCircle Price (₹) <span className="text-destructive">*</span>
          </label>
          <Input
            id="price-labcircle"
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 400"
            value={labCirclePrice === 0 && errors.labCirclePrice ? "" : labCirclePrice}
            onChange={(e) => handleNumberInput("labCirclePrice", e.target.value)}
            aria-invalid={!!errors.labCirclePrice}
          />
          {errors.labCirclePrice && <p className="text-xs text-destructive">{errors.labCirclePrice}</p>}
        </div>
      </div>
    </div>
  );
}
