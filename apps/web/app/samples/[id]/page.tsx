// apps/web/app/samples/[id]/page.tsx

"use client";

import React, { useMemo } from "react";
import { useSample } from "../../../lib/sample/hooks/useSample";
import { useOrders } from "../../../lib/order/hooks/useOrders";
import { usePatients } from "../../../lib/patient/hooks/usePatients";

import SampleDetailsHeader from "../../../lib/sample/components/SampleDetailsHeader";
import SampleSummaryCard from "../../../lib/sample/components/SampleSummaryCard";
import PatientInformationCard from "../../../lib/sample/components/PatientInformationCard";
import OrderInformationCard from "../../../lib/sample/components/OrderInformationCard";
import SampleItemsCard from "../../../lib/sample/components/SampleItemsCard";
import CollectionInformationCard from "../../../lib/sample/components/CollectionInformationCard";
import WorkflowTimeline from "../../../lib/sample/components/WorkflowTimeline";
import AuditInformationCard from "../../../lib/sample/components/AuditInformationCard";
import LoadingSkeleton from "../../../lib/sample/components/LoadingSkeleton";
import ErrorState from "../../../lib/sample/components/ErrorState";
import EmptyState from "../../../lib/sample/components/EmptyState";

interface SampleDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function SampleDetailsPage({ params }: SampleDetailsPageProps) {
  const { id } = React.use(params);
  const { data: sample, loading: sampleLoading, error: sampleError, refetch } = useSample(id);
  const { data: orders } = useOrders();
  const { data: patients } = usePatients();

  // Related order and patient lookups
  const relatedOrder = useMemo(() => {
    if (!sample || !orders) return null;
    return orders.find((o) => o.id === sample.orderId) ?? null;
  }, [sample, orders]);

  const relatedPatient = useMemo(() => {
    if (!sample || !patients) return null;
    return patients.find((p) => p.id === sample.patientId) ?? null;
  }, [sample, patients]);

  // Loading state
  if (sampleLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <LoadingSkeleton />
      </div>
    );
  }

  // Error state
  if (sampleError) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <ErrorState error={sampleError} onRetry={refetch} />
      </div>
    );
  }

  // Empty state
  if (!sample) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <EmptyState title="Sample Not Found" description={`No sample found with ID "${id}".`} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <SampleDetailsHeader sample={sample} onStatusUpdated={refetch} />

      {/* Two-column layout (Desktop) / Single-column layout (Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Core Specimen & Collection Details */}
        <div className="lg:col-span-7 space-y-6">
          <SampleSummaryCard
            sample={sample}
            order={relatedOrder}
            patient={relatedPatient}
          />
          <SampleItemsCard items={sample.items} />
          <CollectionInformationCard sample={sample} />
          <AuditInformationCard sample={sample} />
        </div>

        {/* Right Column: Workflow Progression & Linked Entities */}
        <div className="lg:col-span-5 space-y-6">
          <WorkflowTimeline currentStatus={sample.status} />
          <PatientInformationCard
            patient={relatedPatient}
            patientId={sample.patientId}
          />
          <OrderInformationCard
            order={relatedOrder}
            orderId={sample.orderId}
          />
        </div>
      </div>
    </div>
  );
}
