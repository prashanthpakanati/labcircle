// apps/web/lib/integration/models/form.ts

import { ClientType, SDKLanguage } from "./enums";

export interface CreateAPIClientFormData {
  clientName: string;
  clientType: ClientType;
  developerId: string;
  scopes: string[];
}

export interface RegisterWebhookFormData {
  developerId: string;
  targetUrl: string;
  events: string[];
}

export interface GenerateSDKFormData {
  language: SDKLanguage;
  version: string;
}
