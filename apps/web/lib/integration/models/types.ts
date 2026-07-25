// apps/web/lib/integration/models/types.ts

import { Timestamp } from "firebase/firestore";
import {
  AuthenticationType,
  APIStatus,
  WebhookStatus,
  EventStatus,
  SDKLanguage,
  ClientType,
  IntegrationStatus,
} from "./enums";

export interface APIClient {
  id: string;
  clientName: string;
  clientType: ClientType;
  developerId: string;
  authType: AuthenticationType;
  status: IntegrationStatus;
  createdAt: Timestamp;
}

export interface APIKey {
  id: string;
  clientId: string;
  keyPrefix: string;
  keyHash: string;
  scopes: string[];
  rateLimitPerMin: number;
  status: IntegrationStatus;
  createdAt: Timestamp;
}

export interface AccessToken {
  id: string;
  tokenHash: string;
  clientId: string;
  scopes: string[];
  expiresAt: Timestamp;
}

export interface APIRequest {
  id: string;
  clientKeyId: string;
  path: string;
  method: string;
  statusCode: number;
  latencyMs: number;
  createdAt: Timestamp;
}

export interface WebhookSubscription {
  id: string;
  developerId: string;
  targetUrl: string;
  events: string[];
  secretKey: string;
  status: APIStatus;
  createdAt: Timestamp;
}

export interface WebhookDelivery {
  id: string;
  subscriptionId: string;
  eventId: string;
  signature: string;
  statusCode: number;
  attempts: number;
  status: WebhookStatus;
  deliveredAt?: Timestamp | null;
}

export interface DomainEvent {
  id: string;
  eventType: string;
  sourceDomain: string;
  payload: Record<string, unknown>;
  status: EventStatus;
  createdAt: Timestamp;
}

export interface SDKRelease {
  id: string;
  language: SDKLanguage;
  version: string;
  downloadUrl: string;
  createdAt: Timestamp;
}

export interface SandboxAccount {
  id: string;
  developerId: string;
  mockApiKey: string;
  createdAt: Timestamp;
}

export interface IntegrationAuditRecord {
  id: string;
  action: string;
  clientKeyId: string;
  ipAddress: string;
  targetEndpoint: string;
  timestamp: Timestamp;
}
