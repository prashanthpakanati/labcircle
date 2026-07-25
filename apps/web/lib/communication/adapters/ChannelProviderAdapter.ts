// apps/web/lib/communication/adapters/ChannelProviderAdapter.ts

import { CommunicationChannel, CommunicationStatus } from "../models/enums";
import { CommunicationResult } from "../models/types";

export interface ChannelProviderAdapter {
  providerName: string;
  supportedChannel: CommunicationChannel;
  send(recipient: string, messageBody: string, subject?: string): Promise<CommunicationResult>;
  healthCheck(): Promise<boolean>;
}

export class MockCommunicationAdapter implements ChannelProviderAdapter {
  providerName = "MockCommunicationAdapter";
  supportedChannel: CommunicationChannel;

  constructor(channel: CommunicationChannel = CommunicationChannel.SMS) {
    this.supportedChannel = channel;
  }

  async send(recipient: string, messageBody: string, subject?: string): Promise<CommunicationResult> {
    if (!recipient || !messageBody || (subject && subject.length < 0)) throw new Error("Recipient and message body are required.");

    return {
      requestId: `REQ-${Date.now()}`,
      providerName: this.providerName,
      providerMessageId: `MSG-${this.supportedChannel}-${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      status: CommunicationStatus.DELIVERED,
    };
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }
}
