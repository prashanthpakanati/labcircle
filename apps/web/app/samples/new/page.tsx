// apps/web/app/samples/new/page.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CreateSampleHeader from "../../../lib/sample/components/CreateSampleHeader";
import OrderSelector from "../../../lib/sample/components/OrderSelector";
import OrderSummaryCard from "../../../lib/sample/components/OrderSummaryCard";
import GeneratedSampleItemsCard from "../../../lib/sample/components/GeneratedSampleItemsCard";
import CollectionDetailsCard from "../../../lib/sample/components/CollectionDetailsCard";
import SampleReviewCard from "../../../lib/sample/components/SampleReviewCard";
import { createSampleItemsFromOrder } from "../../../lib/sample/utils/createSampleItemsFromOrder";
import { useCreateSample } from "../../../lib/sample/hooks/useCreateSample";
import { validateSample } from "../../../lib/sample/validation/validateSample";
import { CollectionType, CollectorType } from "../../../lib/sample/models/enums";
import { SampleItem } from "../../../lib/sample/models/types";
import { Order } from "../../../lib/order/models/types";
import { Patient } from "../../../lib/patient/models/types";

export default function CreateSamplePage() {
  const router = useRouter();
  const { createSample, loading: isSubmitting, error: submitError } = useCreateSample();

  // State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [sampleItems, setSampleItems] = useState<SampleItem[]>([]);
  const [collectionType, setCollectionType] = useState<CollectionType>(CollectionType.Lab);
  const [collectorType, setCollectorType] = useState<CollectorType>(CollectorType.Internal);
  const [collectorId, setCollectorId] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Validation & Server Errors
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<string, string>>
  >({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Handle Order Selection
  const handleSelectOrder = (order: Order | null, patient: Patient | null) => {
    setSelectedOrder(order);
    setSelectedPatient(patient);
    setServerError(null);
    setFieldErrors({});

    if (order) {
      const generated = createSampleItemsFromOrder(order);
      setSampleItems(generated);

      // Pre-select collection type based on Order's collection type if available
      if (order.collectionType === "Home") {
        setCollectionType(CollectionType.Home);
      } else {
        setCollectionType(CollectionType.Lab);
      }
    } else {
      setSampleItems([]);
    }
  };

  // Handle updating individual sample items
  const handleUpdateItem = (index: number, updatedItem: SampleItem) => {
    setSampleItems((prev) => {
      const copy = [...prev];
      copy[index] = updatedItem;
      return copy;
    });
  };

  // Submit Handler
  const handleSubmit = async () => {
    setServerError(null);

    const formData = {
      orderId: selectedOrder?.id ?? "",
      patientId: selectedOrder?.patientId ?? "",
      collectionType,
      collectorType,
      collectorId: collectorId.trim(),
      items: sampleItems,
      notes: notes.trim() || undefined,
    };

    const validation = validateSample(formData);

    if (!validation.isValid) {
      setFieldErrors(validation.errors as Partial<Record<string, string>>);
      return;
    }

    setFieldErrors({});

    const created = await createSample(formData);
    if (created) {
      router.push(`/samples/${created.id}`);
    } else {
      setServerError(
        submitError?.message ?? "Failed to create sample collection. Please try again."
      );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <CreateSampleHeader />

      {/* Responsive Two-Column Layout (Desktop) / Single-Column Layout (Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Selection & Configuration */}
        <div className="lg:col-span-7 space-y-6">
          <OrderSelector
            selectedOrder={selectedOrder}
            onSelectOrder={handleSelectOrder}
            error={fieldErrors.orderId || fieldErrors.patientId}
          />

          {selectedOrder && (
            <>
              <GeneratedSampleItemsCard
                items={sampleItems}
                onUpdateItem={handleUpdateItem}
                error={fieldErrors.items}
              />

              <CollectionDetailsCard
                collectionType={collectionType}
                collectorType={collectorType}
                collectorId={collectorId}
                notes={notes}
                onChangeCollectionType={setCollectionType}
                onChangeCollectorType={setCollectorType}
                onChangeCollectorId={setCollectorId}
                onChangeNotes={setNotes}
                errors={{
                  collectionType: fieldErrors.collectionType,
                  collectorType: fieldErrors.collectorType,
                  collectorId: fieldErrors.collectorId,
                }}
              />
            </>
          )}
        </div>

        {/* Right Column: Summaries & Final Review */}
        <div className="lg:col-span-5 space-y-6">
          {selectedOrder && (
            <OrderSummaryCard order={selectedOrder} patient={selectedPatient} />
          )}

          <SampleReviewCard
            order={selectedOrder}
            patient={selectedPatient}
            items={sampleItems}
            collectionType={collectionType}
            collectorType={collectorType}
            collectorId={collectorId}
            notes={notes}
            isSubmitting={isSubmitting}
            serverError={serverError}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/samples")}
          />
        </div>
      </div>
    </div>
  );
}
