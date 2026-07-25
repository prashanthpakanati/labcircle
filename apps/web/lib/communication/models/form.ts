// apps/web/lib/communication/models/form.ts

import { CommunicationChannel, NotificationCategory } from "./enums";

export interface PublishEventFormData {
  eventType: string;
  sourceDomain: string;
  recipientId: string;
  recipientEmail?: string;
  recipientPhone?: string;
  payload: Record<string, unknown>;
}

export interface CreateTemplateFormData {
  code: string;
  name: string;
  channel: CommunicationChannel;
  category: NotificationCategory;
  subjectTemplate?: string;
  bodyTemplate: string;
}

export interface UpdatePreferencesFormData {
  userId: string;
  smsConsent: boolean;
  whatsappConsent: boolean;
  emailConsent: boolean;
  pushConsent: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}
