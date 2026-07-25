// apps/web/lib/commerce/components/PricingSummaryCard.tsx

import React from "react";
import { Tag, ShieldCheck, Zap, Receipt } from "lucide-react";
import { PricingBreakdown } from "../models/types";

interface PricingSummaryCardProps {
  pricing: PricingBreakdown;
}

export default function PricingSummaryCard({ pricing }: PricingSummaryCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 max-w-md">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Receipt className="h-4 w-4 text-indigo-600" /> Payment & Billing Summary
        </h4>
        <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
          LabCircle Guarantee
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-slate-600">
          <span>Base Test Price</span>
          <span className="font-semibold text-slate-900">₹{pricing.basePrice}</span>
        </div>

        {pricing.homeCollectionFee > 0 && (
          <div className="flex justify-between text-slate-600">
            <span>Home Sample Collection</span>
            <span className="font-semibold text-slate-900">₹{pricing.homeCollectionFee}</span>
          </div>
        )}

        {pricing.expressFee > 0 && (
          <div className="flex justify-between text-amber-700">
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-amber-500" /> ⚡ Express 60-Min Surcharge
            </span>
            <span className="font-bold">₹{pricing.expressFee}</span>
          </div>
        )}

        {pricing.membershipDiscount > 0 && (
          <div className="flex justify-between text-emerald-700">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-600" /> Membership Discount
            </span>
            <span className="font-bold">-₹{pricing.membershipDiscount}</span>
          </div>
        )}

        {pricing.couponDiscount > 0 && (
          <div className="flex justify-between text-purple-700">
            <span className="flex items-center gap-1">
              <Tag className="h-3 w-3 text-purple-600" /> Coupon Discount
            </span>
            <span className="font-bold">-₹{pricing.couponDiscount}</span>
          </div>
        )}

        <div className="border-t border-slate-100 pt-2 flex justify-between text-slate-500 text-[11px]">
          <span>Taxable Amount</span>
          <span>₹{pricing.taxableAmount}</span>
        </div>

        <div className="flex justify-between text-slate-500 text-[11px]">
          <span>GST (CGST 9% + SGST 9%)</span>
          <span>₹{pricing.cgst + pricing.sgst + pricing.igst}</span>
        </div>

        <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
          <span className="text-sm font-black text-slate-900">Total Payable</span>
          <span className="text-lg font-black text-indigo-600">₹{pricing.totalPayable}</span>
        </div>
      </div>
    </div>
  );
}
