// apps/web/lib/communication/__tests__/preferenceEngine.test.ts

import { describe, it, expect } from "vitest";
import { PreferenceEngine } from "../utils/PreferenceEngine";
import { CommunicationChannel, ConsentStatus } from "../models/enums";
import { Timestamp } from "firebase/firestore";
import { NotificationPreference } from "../models/types";

describe("PreferenceEngine Consent & Quiet Hours Rules", () => {
  const pref: NotificationPreference = {
    userId: "u-100",
    smsConsent: ConsentStatus.OPTED_IN,
    whatsappConsent: ConsentStatus.OPTED_OUT,
    emailConsent: ConsentStatus.OPTED_IN,
    pushConsent: ConsentStatus.OPTED_IN,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
    updatedAt: { seconds: 1000 } as unknown as Timestamp,
  };

  it("allows communication when user is opted in", () => {
    const res = PreferenceEngine.evaluateConsent(pref, CommunicationChannel.SMS, false);
    expect(res.isAllowed).toBe(true);
  });

  it("suppresses communication when user has opted out of WhatsApp", () => {
    const res = PreferenceEngine.evaluateConsent(pref, CommunicationChannel.WHATSAPP, false);
    expect(res.isAllowed).toBe(false);
    expect(res.reason).toMatch(/opted out of WhatsApp/);
  });

  it("allows critical emergency notifications even if channel is opted out", () => {
    const res = PreferenceEngine.evaluateConsent(pref, CommunicationChannel.WHATSAPP, true);
    expect(res.isAllowed).toBe(true);
  });
});
