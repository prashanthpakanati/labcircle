// apps/web/lib/clinical/utils/ReportDeliveryEngine.ts

import { ReportShare } from "../models/types";
import { ShareType } from "../models/enums";
import { Timestamp } from "firebase/firestore";

export class ReportDeliveryEngine {
  private static readonly DEFAULT_SHARE_TTL_HOURS = 48;

  /**
   * Generates a unique secure share token and computes expiration timestamp.
   */
  static createShareRecord(
    reportId: string,
    patientId: string,
    shareType: ShareType,
    sharedWithEmail?: string,
    expiryHours = ReportDeliveryEngine.DEFAULT_SHARE_TTL_HOURS
  ): Partial<ReportShare> {
    const tokenBuffer = new Uint8Array(16);
    crypto.getRandomValues(tokenBuffer);
    const shareToken = Array.from(tokenBuffer).map((b) => b.toString(16).padStart(2, "0")).join("");

    const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

    return {
      reportId,
      patientId,
      shareType,
      sharedWithEmail,
      shareToken,
      expiresAt: Timestamp.fromDate(expiresAt),
      viewCount: 0,
      maxViews: shareType === ShareType.EXPIRING_LINK ? 5 : undefined,
    };
  }

  /**
   * Validates if a share link is active and unexpired.
   */
  static isShareValid(share: ReportShare): { isValid: boolean; reason?: string } {
    if (share.expiresAt.toMillis() < Date.now()) {
      return { isValid: false, reason: "Share link has expired." };
    }
    if (share.maxViews !== undefined && share.viewCount >= share.maxViews) {
      return { isValid: false, reason: "Maximum view limit reached for this link." };
    }
    return { isValid: true };
  }
}
