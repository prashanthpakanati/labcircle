// apps/web/lib/order/components/OrdersHeader.tsx

"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrdersHeaderProps {
  totalCount?: number;
}

export default function OrdersHeader({ totalCount = 0 }: OrdersHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-border mb-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Order Management</h1>
          <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full font-semibold">
            {totalCount} Total
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Track, search, and manage diagnostic orders and patient collections.
        </p>
      </div>

      <Link href="/orders/new" passHref legacyBehavior>
        <Button variant="primary" size="sm" className="gap-1.5 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Create Order
        </Button>
      </Link>
    </header>
  );
}
