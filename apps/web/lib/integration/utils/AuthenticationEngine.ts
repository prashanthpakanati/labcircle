// apps/web/lib/integration/utils/AuthenticationEngine.ts

import { APIKey } from "../models/types";
import { IntegrationStatus } from "../models/enums";

export class AuthenticationEngine {
  /**
   * Verifies an inbound API key against required scopes and status.
   */
  static verifyAPIKey(
    key: APIKey | null,
    requiredScope?: string
  ): { isAuthenticated: boolean; reason?: string } {
    if (!key) {
      return { isAuthenticated: false, reason: "Invalid or missing API key." };
    }

    if (key.status !== IntegrationStatus.ACTIVE) {
      return { isAuthenticated: false, reason: `API key status is ${key.status}.` };
    }

    if (requiredScope && !key.scopes.includes(requiredScope) && !key.scopes.includes("*")) {
      return { isAuthenticated: false, reason: `API key lacks required scope '${requiredScope}'.` };
    }

    return { isAuthenticated: true };
  }
}
