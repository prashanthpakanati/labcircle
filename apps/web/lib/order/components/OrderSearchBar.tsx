// apps/web/lib/order/components/OrderSearchBar.tsx

"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface OrderSearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export default function OrderSearchBar({ value, onChange }: OrderSearchBarProps) {
  return (
    <div className="relative w-full sm:w-80">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search by Order ID, Patient Name or Phone..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 h-9 text-xs"
        aria-label="Search orders"
      />
    </div>
  );
}
