// apps/web/lib/order/components/CreateOrderHeader.tsx

"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateOrderHeader() {
  return (
    <div className="flex flex-col gap-2 mb-6">
      <Link
        href="/orders"
        className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-slate-800 transition-colors"
        aria-label="Back to Orders"
      >
        <ArrowLeft className="h-3.5 w-3.5 mr-1" />
        Back to Orders
      </Link>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create New Order</h1>
      <p className="text-sm text-muted-foreground">
        Select a patient, add diagnostic tests, configure collection preferences, and review order totals.
      </p>
    </div>
  );
}
