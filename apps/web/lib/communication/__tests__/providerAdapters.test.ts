// apps/web/lib/communication/__tests__/providerAdapters.test.ts

import { describe, it, expect } from "vitest";
import { MockCommunicationAdapter } from "../adapters/ChannelProviderAdapter";
import { CommunicationChannel, CommunicationStatus } from "../models/enums";

describe("MockCommunicationAdapter", () => {
  it("executes mock channel dispatch and returns DELIVERED result", async () => {
    const adapter = new MockCommunicationAdapter(CommunicationChannel.SMS);
    const res = await adapter.send("+919988776655", "Your OTP is 4321");

    expect(res.status).toBe(CommunicationStatus.DELIVERED);
    expect(res.providerName).toBe("MockCommunicationAdapter");
    expect(res.providerMessageId).toMatch(/^MSG-SMS-/);
  });
});
