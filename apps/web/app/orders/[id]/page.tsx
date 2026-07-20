// apps/web/app/orders/[id]/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useOrder } from "../../../lib/order/hooks/useOrder";
import OrderDetailsHeader from "../../../lib/order/components/OrderDetailsHeader";
import OrderSummaryCard from "../../../lib/order/components/OrderSummaryCard";
import PatientInfoCard from "../../../lib/order/components/PatientInfoCard";
import OrderedTestsCard from "../../../lib/order/components/OrderedTestsCard";
import PricingSummaryDetailCard from "../../../lib/order/components/PricingSummaryDetailCard";
import OrderNotesCard from "../../../lib/order/components/OrderNotesCard";
import OrderAuditCard from "../../../lib/order/components/OrderAuditCard";
import LoadingSkeleton from "../../../lib/order/components/LoadingSkeleton";
import ErrorState from "../../../lib/order/components/ErrorState";
import EmptyState from "../../../lib/order/components/EmptyState";
import { Button } from "@/components/ui/button";

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const resolvedParams = React.use(params);
  const { data: order, loading, error } = useOrder(resolvedParams.id);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-4">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-4">
        <ErrorState error={error} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 max-w-7xl mx-auto py-12 border border-dashed rounded-lg">
        <EmptyState
          title="Order Not Found"
          description={`The order with ID "${resolvedParams.id}" was not found.`}
          action={
            <Link href="/orders" passHref legacyBehavior>
              <Button variant="outline" size="sm">
                Back to Orders
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <OrderDetailsHeader order={order} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left main column (span 2 on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <OrderedTestsCard items={order.items} />
          <OrderNotesCard notes={order.notes} />
          <OrderAuditCard order={order} />
        </div>

        {/* Right summary column (span 1 on desktop) */}
        <div className="space-y-6">
          <OrderSummaryCard order={order} />
          <PatientInfoCard patientId={order.patientId} />
          <PricingSummaryDetailCard items={order.items} discount={order.discount} />
        </div>
      </div>
    </div>
  );
}
