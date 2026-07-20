// apps/web/lib/order/components/OrderFilters.tsx

"use client";

import React from "react";
import { OrderStatus, PaymentStatus, OrderCollectionType } from "../models/enums";

export type DateRangeFilter = "ALL" | "TODAY" | "THIS_WEEK" | "THIS_MONTH";
export type SortOption = "NEWEST" | "OLDEST" | "HIGHEST_AMOUNT" | "LOWEST_AMOUNT";

interface OrderFiltersProps {
  statusFilter: string;
  paymentStatusFilter: string;
  collectionFilter: string;
  dateRangeFilter: DateRangeFilter;
  sortOption: SortOption;
  onStatusChange: (val: string) => void;
  onPaymentStatusChange: (val: string) => void;
  onCollectionChange: (val: string) => void;
  onDateRangeChange: (val: DateRangeFilter) => void;
  onSortChange: (val: SortOption) => void;
}

export default function OrderFilters({
  statusFilter,
  paymentStatusFilter,
  collectionFilter,
  dateRangeFilter,
  sortOption,
  onStatusChange,
  onPaymentStatusChange,
  onCollectionChange,
  onDateRangeChange,
  onSortChange,
}: OrderFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
      {/* Order Status */}
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
        aria-label="Filter by Order Status"
      >
        <option value="ALL">All Order Statuses</option>
        {Object.values(OrderStatus).map((st) => (
          <option key={st} value={st}>
            {st}
          </option>
        ))}
      </select>

      {/* Payment Status */}
      <select
        value={paymentStatusFilter}
        onChange={(e) => onPaymentStatusChange(e.target.value)}
        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
        aria-label="Filter by Payment Status"
      >
        <option value="ALL">All Payment Statuses</option>
        {Object.values(PaymentStatus).map((st) => (
          <option key={st} value={st}>
            {st}
          </option>
        ))}
      </select>

      {/* Collection Type */}
      <select
        value={collectionFilter}
        onChange={(e) => onCollectionChange(e.target.value)}
        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
        aria-label="Filter by Collection Type"
      >
        <option value="ALL">All Collection Types</option>
        {Object.values(OrderCollectionType).map((ct) => (
          <option key={ct} value={ct}>
            {ct === OrderCollectionType.Home ? "Home Collection" : "Walk-in (Lab)"}
          </option>
        ))}
      </select>

      {/* Date Range */}
      <select
        value={dateRangeFilter}
        onChange={(e) => onDateRangeChange(e.target.value as DateRangeFilter)}
        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
        aria-label="Filter by Date Range"
      >
        <option value="ALL">All Time</option>
        <option value="TODAY">Created Today</option>
        <option value="THIS_WEEK">This Week</option>
        <option value="THIS_MONTH">This Month</option>
      </select>

      {/* Sort Option */}
      <select
        value={sortOption}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
        aria-label="Sort Order"
      >
        <option value="NEWEST">Newest First</option>
        <option value="OLDEST">Oldest First</option>
        <option value="HIGHEST_AMOUNT">Highest Amount</option>
        <option value="LOWEST_AMOUNT">Lowest Amount</option>
      </select>
    </div>
  );
}
