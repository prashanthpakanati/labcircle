// apps/web/lib/communication/utils/NotificationEngine.ts

import { CommunicationChannel, CommunicationStatus } from "../models/enums";
import { CommunicationRequest } from "../models/types";
import { MockCommunicationAdapter } from "../adapters/ChannelProviderAdapter";

export class NotificationEngine {
  private static mockAdapters: Record<string, MockCommunicationAdapter> = {
    [CommunicationChannel.SMS]: new MockCommunicationAdapter(CommunicationChannel.SMS),
    [CommunicationChannel.WHATSAPP]: new MockCommunicationAdapter(CommunicationChannel.WHATSAPP),
    [CommunicationChannel.EMAIL]: new MockCommunicationAdapter(CommunicationChannel.EMAIL),
    [CommunicationChannel.PUSH]: new MockCommunicationAdapter(CommunicationChannel.PUSH),
    [CommunicationChannel.IN_APP]: new MockCommunicationAdapter(CommunicationChannel.IN_APP),
  };

  /**
   * Routes request to designated provider adapter, manages retries, and invokes fallback channel on failure.
   */
  static async dispatchRequest(
    request: CommunicationRequest,
    renderedBody: string,
    renderedSubject?: string
  ): Promise<{ status: CommunicationStatus; providerName: string; providerMessageId: string; attempts: number }> {
    let attempts = 0;
    let adapter = this.mockAdapters[request.channel] ?? this.mockAdapters[CommunicationChannel.SMS];

    while (attempts <= request.maxRetries) {
      attempts++;
      try {
        const res = await adapter.send(request.recipientContact, renderedBody, renderedSubject);
        if (res.status === CommunicationStatus.DELIVERED || res.status === CommunicationStatus.SENT) {
          return {
            status: res.status,
            providerName: res.providerName,
            providerMessageId: res.providerMessageId,
            attempts,
          };
        }
      } catch {
        if (attempts > request.maxRetries && request.fallbackChannel) {
          // Switch to fallback channel
          adapter = this.mockAdapters[request.fallbackChannel] ?? this.mockAdapters[CommunicationChannel.SMS];
          const fallbackRes = await adapter.send(request.recipientContact, renderedBody, renderedSubject);
          return {
            status: fallbackRes.status,
            providerName: `${fallbackRes.providerName}-FALLBACK`,
            providerMessageId: fallbackRes.providerMessageId,
            attempts,
          };
        }
      }
    }

    return {
      status: CommunicationStatus.FAILED,
      providerName: adapter.providerName,
      providerMessageId: "FAILED",
      attempts,
    };
  }
}
