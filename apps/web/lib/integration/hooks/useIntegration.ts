// apps/web/lib/integration/hooks/useIntegration.ts

"use client";

import { useState, useCallback } from "react";
import { IntegrationService } from "../services/IntegrationService";
import { CreateAPIClientFormData, RegisterWebhookFormData, GenerateSDKFormData } from "../models/form";

const service = new IntegrationService();

export function useIntegrationMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAPIClient = useCallback(async (formData: CreateAPIClientFormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await service.createAPIClient(formData);
      setLoading(false);
      return res;
    } catch (err: unknown) {
      setError((err as Error).message);
      setLoading(false);
      return null;
    }
  }, []);

  const registerWebhook = useCallback(async (formData: RegisterWebhookFormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await service.registerWebhook(formData);
      setLoading(false);
      return res;
    } catch (err: unknown) {
      setError((err as Error).message);
      setLoading(false);
      return null;
    }
  }, []);

  const generateSDK = useCallback((formData: GenerateSDKFormData) => {
    try {
      return service.generateSDK(formData);
    } catch (err: unknown) {
      setError((err as Error).message);
      return null;
    }
  }, []);

  return { createAPIClient, registerWebhook, generateSDK, loading, error };
}
