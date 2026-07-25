// apps/web/lib/integration/models/enums.ts

export enum APIProtocol {
  REST = "REST",
  GRAPHQL = "GRAPHQL",
  WEBHOOK = "WEBHOOK",
  EVENT_BUS = "EVENT_BUS",
}

export enum AuthenticationType {
  OAUTH2 = "OAUTH2",
  API_KEY = "API_KEY",
  JWT = "JWT",
}

export enum OAuthGrantType {
  AUTHORIZATION_CODE = "AUTHORIZATION_CODE",
  CLIENT_CREDENTIALS = "CLIENT_CREDENTIALS",
  REFRESH_TOKEN = "REFRESH_TOKEN",
}

export enum APIStatus {
  ACTIVE = "ACTIVE",
  DEPRECATED = "DEPRECATED",
  RETIRED = "RETIRED",
}

export enum WebhookStatus {
  PENDING = "PENDING",
  DELIVERING = "DELIVERING",
  DELIVERED = "DELIVERED",
  FAILED = "FAILED",
  RETRY = "RETRY",
}

export enum EventStatus {
  PUBLISHED = "PUBLISHED",
  PROCESSED = "PROCESSED",
  FAILED = "FAILED",
  DEAD_LETTER = "DEAD_LETTER",
}

export enum SDKLanguage {
  TYPESCRIPT = "TYPESCRIPT",
  JAVASCRIPT = "JAVASCRIPT",
  PYTHON = "PYTHON",
  KOTLIN = "KOTLIN",
  SWIFT = "SWIFT",
}

export enum RateLimitPolicy {
  STRICT = "STRICT",
  BURSTABLE = "BURSTABLE",
  UNLIMITED = "UNLIMITED",
}

export enum ClientType {
  MOBILE_APP = "MOBILE_APP",
  PARTNER_LAB = "PARTNER_LAB",
  HOSPITAL_HIS = "HOSPITAL_HIS",
  THIRD_PARTY = "THIRD_PARTY",
}

export enum IntegrationStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  REVOKED = "REVOKED",
}

export enum ScopeType {
  BOOKING_READ = "booking:read",
  BOOKING_WRITE = "booking:write",
  REPORTS_READ = "reports:read",
  PATIENT_READ = "patient:read",
  PAYMENTS_READ = "payments:read",
}
