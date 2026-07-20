// apps/web/app/orders/page.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useOrders } from "../../lib/order/hooks/useOrders";
import { usePatients } from "../../lib/patient/hooks/usePatients";
import { Patient } from "../../lib/patient/models/types";

import OrdersHeader from "../../lib/order/components/OrdersHeader";
import OrderDashboardCards from "../../lib/order/components/OrderDashboardCards";
import OrderSearchBar from "../../lib/order/components/OrderSearchBar";
import OrderFilters, { DateRangeFilter, SortOption } from "../../lib/order/components/OrderFilters";
import OrdersTable from "../../lib/order/components/OrdersTable";
import OrdersMobileCards from "../../lib/order/components/OrdersMobileCards";
import LoadingSkeleton from "../../lib/order/components/LoadingSkeleton";
import ErrorState from "../../lib/order/components/ErrorState";
import EmptyState from "../../lib/order/components/EmptyState";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

const PAGE_SIZE = 10;

export default function OrdersPage() {
  const { data: orders, loading: loadingOrders, error: ordersError } = useOrders();
  const { data: patients } = usePatients();

  // Search, Filter & Sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("ALL");
  const [collectionFilter, setCollectionFilter] = useState("ALL");
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRangeFilter>("ALL");
  const [sortOption, setSortOption] = useState<SortOption>("NEWEST");
  const [currentPage, setCurrentPage] = useState(1);

  // Patient Lookup Map for O(1) patient name & phone resolution
  const patientMap = useMemo(() => {
    const map = new Map<string, Patient>();
    if (patients) {
      patients.forEach((p) => map.set(p.id, p));
    }
    return map;
  }, [patients]);

  // Reset pagination to page 1 when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, paymentStatusFilter, collectionFilter, dateRangeFilter, sortOption]);

  // Combined AND filtering & sorting
  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).getTime();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    const q = searchQuery.toLowerCase().trim();

    const filtered = orders.filter((order) => {
      // Search check
      if (q) {
        const patient = patientMap.get(order.patientId);
        const patientName = patient ? `${patient.firstName} ${patient.lastName}`.toLowerCase() : "";
        const patientPhone = patient ? patient.phone : "";
        const matchesSearch =
          order.displayId.toLowerCase().includes(q) ||
          patientName.includes(q) ||
          patientPhone.includes(q);
        if (!matchesSearch) return false;
      }

      // Order Status check
      if (statusFilter !== "ALL" && order.status !== statusFilter) {
        return false;
      }

      // Payment Status check
      if (paymentStatusFilter !== "ALL" && order.paymentStatus !== paymentStatusFilter) {
        return false;
      }

      // Collection Type check
      if (collectionFilter !== "ALL" && order.collectionType !== collectionFilter) {
        return false;
      }

      // Date Range check
      if (dateRangeFilter !== "ALL") {
        const orderTime = new Date(order.createdAt).getTime();
        if (isNaN(orderTime)) return false;
        if (dateRangeFilter === "TODAY" && orderTime < startOfToday) return false;
        if (dateRangeFilter === "THIS_WEEK" && orderTime < startOfWeek) return false;
        if (dateRangeFilter === "THIS_MONTH" && orderTime < startOfMonth) return false;
      }

      return true;
    });

    // Sorting
    return filtered.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime() || 0;
      const timeB = new Date(b.createdAt).getTime() || 0;

      if (sortOption === "NEWEST") return timeB - timeA;
      if (sortOption === "OLDEST") return timeA - timeB;
      if (sortOption === "HIGHEST_AMOUNT") return (b.total || 0) - (a.total || 0);
      if (sortOption === "LOWEST_AMOUNT") return (a.total || 0) - (b.total || 0);
      return 0;
    });
  }, [
    orders,
    patientMap,
    searchQuery,
    statusFilter,
    paymentStatusFilter,
    collectionFilter,
    dateRangeFilter,
    sortOption,
  ]);

  // Paginated slice
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, currentPage]);

  if (loadingOrders) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-4">
        <LoadingSkeleton />
      </div>
    );
  }

  if (ordersError) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-4">
        <ErrorState error={ordersError} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <OrdersHeader totalCount={orders?.length || 0} />

      {orders && orders.length > 0 && <OrderDashboardCards orders={orders} />}

      {!orders || orders.length === 0 ? (
        <div className="py-12 border border-dashed rounded-lg">
          <EmptyState
            title="No Orders Found"
            description="There are no orders registered in the system yet. Create your first order to get started."
            action={
              <Link href="/orders/new" passHref legacyBehavior>
                <Button variant="primary" size="sm" className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  Create New Order
                </Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Controls bar: Search & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-lg border border-border">
            <OrderSearchBar value={searchQuery} onChange={setSearchQuery} />
            <OrderFilters
              statusFilter={statusFilter}
              paymentStatusFilter={paymentStatusFilter}
              collectionFilter={collectionFilter}
              dateRangeFilter={dateRangeFilter}
              sortOption={sortOption}
              onStatusChange={setStatusFilter}
              onPaymentStatusChange={setPaymentStatusFilter}
              onCollectionChange={setCollectionFilter}
              onDateRangeChange={setDateRangeFilter}
              onSortChange={setSortOption}
            />
          </div>

          {/* Results check */}
          {filteredOrders.length === 0 ? (
            <div className="py-12 border border-dashed rounded-lg bg-white">
              <EmptyState
                title="No Matching Orders"
                description="No orders match your current search and filter criteria. Try clearing search or adjusting filters."
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("ALL");
                      setPaymentStatusFilter("ALL");
                      setCollectionFilter("ALL");
                      setDateRangeFilter("ALL");
                      setSortOption("NEWEST");
                    }}
                  >
                    Reset All Filters
                  </Button>
                }
              />
            </div>
          ) : (
            <>
              <OrdersTable orders={paginatedOrders} patientMap={patientMap} />
              <OrdersMobileCards orders={paginatedOrders} patientMap={patientMap} />

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
                    {Math.min(currentPage * PAGE_SIZE, filteredOrders.length)} of {filteredOrders.length} orders
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="h-8 gap-1 text-xs"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-xs font-semibold px-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="h-8 gap-1 text-xs"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
