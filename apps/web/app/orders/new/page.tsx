// apps/web/app/orders/new/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CreateOrderHeader from "../../../lib/order/components/CreateOrderHeader";
import PatientSelector from "../../../lib/order/components/PatientSelector";
import TestSelector from "../../../lib/order/components/TestSelector";
import SelectedTestsTable from "../../../lib/order/components/SelectedTestsTable";
import PricingSummaryCard from "../../../lib/order/components/PricingSummaryCard";
import CollectionTypeSelector from "../../../lib/order/components/CollectionTypeSelector";
import OrderReviewCard from "../../../lib/order/components/OrderReviewCard";
import { Patient } from "../../../lib/patient/models/types";
import { Test } from "../../../lib/test/models/types";
import { OrderItem } from "../../../lib/order/models/types";
import { OrderCollectionType } from "../../../lib/order/models/enums";
import { OrderFormData } from "../../../lib/order/models/form";
import { useCreateOrder } from "../../../lib/order/hooks/useCreateOrder";
import { validateOrder } from "../../../lib/order/validation/validateOrder";

export default function CreateOrderPage() {
  const router = useRouter();
  const { createOrder, loading, error: createError } = useCreateOrder();

  // Form State
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [collectionType, setCollectionType] = useState<OrderCollectionType>(OrderCollectionType.Lab);
  const [notes, setNotes] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Item management handlers
  const handleAddTest = (test: Test) => {
    if (items.some((i) => i.testId === test.id)) return;
    const newItem: OrderItem = {
      testId: test.id,
      testName: test.name,
      testCode: test.code,
      priceCharged: test.labCirclePrice,
      quantity: 1,
    };
    setItems((prev) => [...prev, newItem]);
    if (errors.items) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.items;
        return next;
      });
    }
  };

  const handleUpdateQuantity = (testId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.testId === testId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const handleRemoveItem = (testId: string) => {
    setItems((prev) => prev.filter((item) => item.testId !== testId));
  };

  const handleSelectPatient = (patient: Patient | null) => {
    setSelectedPatient(patient);
    if (errors.patientId) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.patientId;
        return next;
      });
    }
  };

  // Submit handler
  const handleSubmit = async () => {
    const formData: OrderFormData = {
      patientId: selectedPatient?.id ?? "",
      collectionType,
      items,
      discount,
      notes,
    };

    const validation = validateOrder(formData);
    if (!validation.isValid) {
      setErrors(validation.errors as Record<string, string>);
      return;
    }

    setErrors({});
    const created = await createOrder(formData);
    if (created) {
      router.push(`/orders/${created.id}`);
    }
  };

  const selectedTestIds = items.map((i) => i.testId);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <CreateOrderHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Workflow Column (Span 2 on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <PatientSelector
            selectedPatient={selectedPatient}
            onSelectPatient={handleSelectPatient}
            error={errors.patientId}
          />

          <TestSelector
            selectedTestIds={selectedTestIds}
            onAddTest={handleAddTest}
            error={errors.items}
          />

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-800">Selected Tests ({items.length})</h3>
            <SelectedTestsTable
              items={items}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
          </div>

          <CollectionTypeSelector
            collectionType={collectionType}
            notes={notes}
            onCollectionTypeChange={setCollectionType}
            onNotesChange={setNotes}
          />
        </div>

        {/* Right Summary Column (Span 1 on desktop) */}
        <div className="space-y-6">
          <PricingSummaryCard
            items={items}
            discount={discount}
            onDiscountChange={setDiscount}
            error={errors.discount}
          />

          <OrderReviewCard
            patient={selectedPatient}
            items={items}
            collectionType={collectionType}
            notes={notes}
            discount={discount}
            isSubmitting={loading}
            onSubmit={handleSubmit}
            serverError={createError?.message}
          />
        </div>
      </div>
    </div>
  );
}
