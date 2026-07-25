// apps/web/lib/communication/hooks/useCommunication.ts

"use client";

import { useState, useEffect, useCallback } from "react";
import { CommunicationService } from "../services/CommunicationService";
import { NotificationPreference } from "../models/types";
import { PublishEventFormData, CreateTemplateFormData, UpdatePreferencesFormData } from "../models/form";

const service = new CommunicationService();

export function useCommunicationPreferences(userId: string | null | undefined) {
  const [preferences, setPreferences] = useState<NotificationPreference | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    service.getPreferences(userId).then((p) => {
      setPreferences(p);
      setLoading(false);
    });
  }, [userId]);

  return { preferences, loading };
}

export function useCommunicationMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const publishEvent = useCallback(async (formData: PublishEventFormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await service.publishEvent(formData);
      setLoading(false);
      return res;
    } catch (err: unknown) {
      setError((err as Error).message);
      setLoading(false);
      return null;
    }
  }, []);

  const createTemplate = useCallback(async (formData: CreateTemplateFormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await service.createTemplate(formData);
      setLoading(false);
      return res;
    } catch (err: unknown) {
      setError((err as Error).message);
      setLoading(false);
      return null;
    }
  }, []);

  const updatePreferences = useCallback(async (formData: UpdatePreferencesFormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await service.updatePreferences(formData);
      setLoading(false);
      return res;
    } catch (err: unknown) {
      setError((err as Error).message);
      setLoading(false);
      return null;
    }
  }, []);

  return { publishEvent, createTemplate, updatePreferences, loading, error };
}
