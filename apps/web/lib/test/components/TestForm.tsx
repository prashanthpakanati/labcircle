// apps/web/lib/test/components/TestForm.tsx

"use client";

import React, { useState, useEffect } from "react";
import GeneralSection from "./GeneralSection";
import ClassificationSection from "./ClassificationSection";
import LaboratorySection from "./LaboratorySection";
import PricingSection from "./PricingSection";
import TatSection from "./TatSection";
import FormActions from "./FormActions";
import { TestDepartment, TestCategory, TestStatus } from "../models/enums";
import { TestFormData } from "../models/form";
import { validateTest } from "../validation/validateTest";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export type FullTestFormState = TestFormData & { status: TestStatus };

const defaultFormState: FullTestFormState = {
  name: "",
  code: "",
  department: TestDepartment.Hematology,
  category: TestCategory.Routine,
  specimenType: "Whole Blood",
  method: "Automated Chemistry",
  homeCollection: true,
  tatHours: 24,
  urgentTatHours: 12,
  mrp: 500,
  b2bPrice: 350,
  labCirclePrice: 400,
  status: TestStatus.Active,
};

interface TestFormProps {
  initialValues?: Partial<FullTestFormState>;
  onSubmit: (data: FullTestFormState) => Promise<void>;
  isSubmitting?: boolean;
  submitText?: string;
  onCancel?: () => void;
  serverError?: string | null;
  existingCodes?: string[];
}

export default function TestForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitText = "Save Test",
  onCancel,
  serverError,
  existingCodes = [],
}: TestFormProps) {
  const mergedInitialState: FullTestFormState = {
    ...defaultFormState,
    ...initialValues,
  };

  const [formData, setFormData] = useState<FullTestFormState>(mergedInitialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState<boolean>(false);

  // Update form state if preloaded initialValues change
  useEffect(() => {
    if (initialValues) {
      setFormData((prev) => ({
        ...prev,
        ...initialValues,
      }));
    }
  }, [initialValues]);

  // Unsaved changes beforeunload detection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isSubmitting) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, isSubmitting]);

  const handleChange = (field: string, value: string | number | boolean) => {
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear field-level error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Run client-side validation
    const validationResult = validateTest(formData);
    const newErrors: Record<string, string> = { ...validationResult.errors };

    // Duplicate test code check
    const trimmedCode = formData.code.trim().toUpperCase();
    if (trimmedCode && existingCodes.includes(trimmedCode)) {
      newErrors.code = "Test code already exists in the catalog";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsDirty(false);
    await onSubmit(formData);
  };

  const handleCancelClick = () => {
    if (isDirty) {
      const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (!confirmLeave) return;
    }
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {serverError && (
        <Alert variant="error">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Submission Error</AlertTitle>
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <GeneralSection
        name={formData.name}
        code={formData.code}
        status={formData.status}
        errors={errors}
        onChange={handleChange}
      />

      <ClassificationSection
        department={formData.department}
        category={formData.category}
        errors={errors}
        onChange={handleChange}
      />

      <LaboratorySection
        specimenType={formData.specimenType}
        method={formData.method}
        homeCollection={formData.homeCollection}
        errors={errors}
        onChange={handleChange}
      />

      <TatSection
        tatHours={formData.tatHours}
        urgentTatHours={formData.urgentTatHours}
        errors={errors}
        onChange={handleChange}
      />

      <PricingSection
        mrp={formData.mrp}
        b2bPrice={formData.b2bPrice}
        labCirclePrice={formData.labCirclePrice}
        errors={errors}
        onChange={handleChange}
      />

      <FormActions
        isSubmitting={isSubmitting}
        submitText={submitText}
        onCancel={handleCancelClick}
      />
    </form>
  );
}
