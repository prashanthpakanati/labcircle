// apps/web/lib/communication/utils/PreferenceEngine.ts

import { ConsentStatus, CommunicationChannel } from "../models/enums";
import { NotificationPreference } from "../models/types";

export class PreferenceEngine {
  /**
   * Validates if a user has opted in to receive communications on a specific channel and respects quiet hours.
   */
  static evaluateConsent(
    preference: NotificationPreference | null,
    channel: CommunicationChannel,
    isCritical = false
  ): { isAllowed: boolean; reason?: string } {
    // Critical system alerts bypass routine quiet hours & marketing opt-outs
    if (isCritical) return { isAllowed: true };

    if (!preference) return { isAllowed: true }; // Default to allowed for transactional

    if (channel === CommunicationChannel.SMS && preference.smsConsent === ConsentStatus.OPTED_OUT) {
      return { isAllowed: false, reason: "User has opted out of SMS notifications." };
    }
    if (channel === CommunicationChannel.WHATSAPP && preference.whatsappConsent === ConsentStatus.OPTED_OUT) {
      return { isAllowed: false, reason: "User has opted out of WhatsApp notifications." };
    }
    if (channel === CommunicationChannel.EMAIL && preference.emailConsent === ConsentStatus.OPTED_OUT) {
      return { isAllowed: false, reason: "User has opted out of Email notifications." };
    }
    if (channel === CommunicationChannel.PUSH && preference.pushConsent === ConsentStatus.OPTED_OUT) {
      return { isAllowed: false, reason: "User has opted out of Push notifications." };
    }

    // Quiet Hours Validation (HH:mm)
    if (preference.quietHoursStart && preference.quietHoursEnd) {
      const now = new Date();
      const currentMins = now.getHours() * 60 + now.getMinutes();

      const [sH, sM] = preference.quietHoursStart.split(":").map(Number);
      const [eH, eM] = preference.quietHoursEnd.split(":").map(Number);

      const startMins = sH * 60 + sM;
      const endMins = eH * 60 + eM;

      let inQuietHours = false;
      if (startMins < endMins) {
        inQuietHours = currentMins >= startMins && currentMins < endMins;
      } else {
        // Overnight quiet hours (e.g. 22:00 to 07:00)
        inQuietHours = currentMins >= startMins || currentMins < endMins;
      }

      if (inQuietHours) {
        return { isAllowed: false, reason: "Message suppressed during user quiet hours." };
      }
    }

    return { isAllowed: true };
  }
}
