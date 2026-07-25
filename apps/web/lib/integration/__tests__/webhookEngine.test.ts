// apps/web/lib/integration/__tests__/webhookEngine.test.ts

import { describe, it, expect } from "vitest";
import { WebhookEngine } from "../utils/WebhookEngine";
import { APIStatus, WebhookStatus } from "../models/enums";
import { Timestamp } from "firebase/firestore";
import { WebhookSubscription } from "../models/types";

describe("WebhookEngine HMAC Signature & Delivery", () => {
  const subscription: WebhookSubscription = {
    id: "sub-100",
    developerId: "dev-1",
    targetUrl: "https://partner.com/webhook",
    events: ["BookingConfirmed"],
    secretKey: "whsec_test_secret_123",
    status: APIStatus.ACTIVE,
    createdAt: { seconds: 1000 } as unknown as Timestamp,
  };

  it("generates deterministic HMAC-SHA256 signature prefix", () => {
    const signature = WebhookEngine.generateSignature(subscription.secretKey, '{"event":"BookingConfirmed"}');
    expect(signature).toMatch(/^sha256=/);
  });

  it("executes webhook delivery payload and returns DELIVERED status", () => {
    const delivery = WebhookEngine.executeDelivery(subscription, "evt-100", '{"bookingId":"B-1"}');
    expect(delivery.status).toBe(WebhookStatus.DELIVERED);
    expect(delivery.statusCode).toBe(200);
  });
});
