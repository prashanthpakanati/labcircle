// apps/web/lib/integration/services/IntegrationService.ts

import { getFirestore, collection, doc, serverTimestamp, Timestamp } from "firebase/firestore";
import { APIRepository } from "../repositories/APIRepository";
import { WebhookRepository } from "../repositories/WebhookRepository";
import { IntegrationAuditRepository } from "../repositories/IntegrationAuditRepository";
import { APIClient, APIKey, WebhookSubscription, SDKRelease, IntegrationAuditRecord } from "../models/types";
import { AuthenticationType, APIStatus, IntegrationStatus } from "../models/enums";
import { CreateAPIClientFormData, RegisterWebhookFormData, GenerateSDKFormData } from "../models/form";
import { AuthenticationEngine } from "../utils/AuthenticationEngine";
import { SDKGeneratorEngine } from "../utils/SDKGeneratorEngine";
import { validateAPIClientCreation, validateWebhookRegistration } from "../validation/validateIntegration";

export type DeveloperRole = "SuperAdmin" | "Admin" | "Developer";

export class IntegrationService {
  private apiRepo = new APIRepository();
  private webhookRepo = new WebhookRepository();
  private auditRepo = new IntegrationAuditRepository();
  private db = getFirestore();

  private async audit(action: string, clientKeyId: string, ipAddress: string, targetEndpoint: string): Promise<void> {
    const id = doc(collection(this.db, "integration_audit")).id;
    const now = serverTimestamp() as unknown as Timestamp;
    const record: IntegrationAuditRecord = {
      id,
      action,
      clientKeyId,
      ipAddress,
      targetEndpoint,
      timestamp: now,
    };
    await this.auditRepo.logAction(record);
  }

  // ── API Gateway Authentication & Routing Entrypoint ──────────────────────

  /**
   * Central API Gateway execution entrypoint.
   */
  async processGatewayRequest(
    apiKeyString: string | undefined,
    requiredScope: string,
    targetEndpoint: string
  ): Promise<{ status: number; payload: Record<string, unknown> }> {
    const keyHash = apiKeyString ? `HASH-${apiKeyString}` : "";
    const apiKey = apiKeyString ? await this.apiRepo.getKeyByHash(keyHash) : null;

    const authRes = AuthenticationEngine.verifyAPIKey(apiKey, requiredScope);
    if (!authRes.isAuthenticated) {
      await this.audit("GATEWAY_AUTH_FAILURE", keyHash || "ANONYMOUS", "127.0.0.1", targetEndpoint);
      return { status: 401, payload: { error: authRes.reason } };
    }

    await this.audit("GATEWAY_REQUEST", apiKey?.id || "KEY-1", "127.0.0.1", targetEndpoint);
    return { status: 200, payload: { message: `Gateway request to ${targetEndpoint} authorized successfully.` } };
  }

  // ── API Key & Webhook Management ────────────────────────────────────────

  async createAPIClient(formData: CreateAPIClientFormData): Promise<{ client: APIClient; apiKey: APIKey; rawSecretKey: string }> {
    const val = validateAPIClientCreation(formData);
    if (!val.isValid) throw new Error(`Validation failed: ${JSON.stringify(val.errors)}`);

    const clientId = doc(collection(this.db, "api_clients")).id;
    const keyId = doc(collection(this.db, "api_keys")).id;
    const now = serverTimestamp() as unknown as Timestamp;

    const rawSecretKey = `lc_live_${Math.random().toString(36).substring(2)}`;
    const keyHash = `HASH-${rawSecretKey}`;

    const client: APIClient = {
      id: clientId,
      clientName: formData.clientName,
      clientType: formData.clientType,
      developerId: formData.developerId,
      authType: AuthenticationType.API_KEY,
      status: IntegrationStatus.ACTIVE,
      createdAt: now,
    };

    const apiKey: APIKey = {
      id: keyId,
      clientId,
      keyPrefix: rawSecretKey.substring(0, 10),
      keyHash,
      scopes: formData.scopes.length > 0 ? formData.scopes : ["*"],
      rateLimitPerMin: 600,
      status: IntegrationStatus.ACTIVE,
      createdAt: now,
    };

    await this.apiRepo.createClient(client);
    await this.apiRepo.createKey(apiKey);
    await this.audit("CREATE_API_CLIENT", keyId, "127.0.0.1", "/developers/api-keys");

    return { client, apiKey, rawSecretKey };
  }

  async registerWebhook(formData: RegisterWebhookFormData): Promise<WebhookSubscription> {
    const val = validateWebhookRegistration(formData);
    if (!val.isValid) throw new Error(`Validation failed: ${JSON.stringify(val.errors)}`);

    const subId = doc(collection(this.db, "webhook_subscriptions")).id;
    const now = serverTimestamp() as unknown as Timestamp;

    const subscription: WebhookSubscription = {
      id: subId,
      developerId: formData.developerId,
      targetUrl: formData.targetUrl,
      events: formData.events,
      secretKey: `whsec_${Math.random().toString(36).substring(2)}`,
      status: APIStatus.ACTIVE,
      createdAt: now,
    };

    await this.webhookRepo.createSubscription(subscription);
    await this.audit("REGISTER_WEBHOOK", subId, "127.0.0.1", "/developers/webhooks");

    return subscription;
  }

  generateSDK(formData: GenerateSDKFormData): SDKRelease {
    const rawSdk = SDKGeneratorEngine.generateSDKPackage(formData.language, formData.version);
    const sdkId = doc(collection(this.db, "sdk_releases")).id;

    return {
      ...rawSdk,
      id: sdkId,
    } as SDKRelease;
  }
}
