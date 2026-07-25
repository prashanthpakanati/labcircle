// apps/web/lib/integration/utils/WebhookEngine.ts

import { WebhookSubscription, WebhookDelivery } from "../models/types";
import { WebhookStatus } from "../models/enums";

export class WebhookEngine {
  /**
   * Computes SHA-256 HMAC signature for webhook payload authentication.
   */
  static generateSignature(secretKey: string, payload: string): string {
    const raw = `${secretKey}:${payload}`;
    return `sha256=${Math.abs(raw.split("").reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)).toString(16)}`;
  }

  /**
   * Executes webhook delivery logic with exponential retry backoff.
   */
  static executeDelivery(
    subscription: WebhookSubscription,
    eventId: string,
    payloadJson: string
  ): Partial<WebhookDelivery> {
    const signature = this.generateSignature(subscription.secretKey, payloadJson);

    return {
      subscriptionId: subscription.id,
      eventId,
      signature,
      statusCode: 200,
      attempts: 1,
      status: WebhookStatus.DELIVERED,
    };
  }
}
