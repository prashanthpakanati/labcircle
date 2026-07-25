// apps/web/lib/communication/services/CommunicationService.ts

import { getFirestore, collection, doc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { TemplateRepository } from "../repositories/TemplateRepository";
import { PreferenceRepository } from "../repositories/PreferenceRepository";
import { CommunicationAuditRepository } from "../repositories/CommunicationAuditRepository";
import { CommunicationEvent, CommunicationRequest, NotificationTemplate, CommunicationAuditRecord, NotificationPreference } from "../models/types";
import { CommunicationChannel, CommunicationPriority, CommunicationStatus, TemplateStatus, ConsentStatus, NotificationCategory } from "../models/enums";
import { PublishEventFormData, CreateTemplateFormData, UpdatePreferencesFormData } from "../models/form";
import { TemplateEngine } from "../utils/TemplateEngine";
import { PreferenceEngine } from "../utils/PreferenceEngine";
import { NotificationEngine } from "../utils/NotificationEngine";
import { validateEventPublish, validateTemplateCreation } from "../validation/validateCommunication";

export type CommRole = "SuperAdmin" | "Admin" | "System" | "User";

export class CommunicationService {
  private templateRepo = new TemplateRepository();
  private prefRepo = new PreferenceRepository();
  private auditRepo = new CommunicationAuditRepository();
  private db = getFirestore();

  private async audit(requestId: string, channel: CommunicationChannel, provider: string, recipient: string, status: CommunicationStatus): Promise<void> {
    const id = doc(collection(this.db, "communication_audit")).id;
    const now = serverTimestamp() as unknown as Timestamp;
    const record: CommunicationAuditRecord = {
      id,
      requestId,
      channel,
      provider,
      recipient,
      payloadHash: `HASH-${Date.now()}`,
      status,
      retryHistory: [],
      timestamp: now,
    };
    await this.auditRepo.logAction(record);
  }

  // ── Communication Event Bus Entrypoint ──────────────────────────────────

  /**
   * Universal entrypoint for all domain communication events.
   * Domains publish events—not messages.
   */
  async publishEvent(formData: PublishEventFormData): Promise<{ eventId: string; status: string; reason?: string }> {
    const val = validateEventPublish(formData);
    if (!val.isValid) throw new Error(`Validation failed: ${JSON.stringify(val.errors)}`);

    const eventId = doc(collection(this.db, "communication_events")).id;
    const now = serverTimestamp() as unknown as Timestamp;

    const event: CommunicationEvent = {
      id: eventId,
      eventType: formData.eventType,
      sourceDomain: formData.sourceDomain,
      recipientId: formData.recipientId,
      recipientEmail: formData.recipientEmail,
      recipientPhone: formData.recipientPhone,
      payload: formData.payload,
      timestamp: now,
    };

    const eventRef = doc(collection(this.db, "communication_events"), eventId);
    await setDoc(eventRef, event);

    // 1. Fetch User Notification Preferences & Consent
    const pref = await this.prefRepo.getPreference(formData.recipientId);
    const channel = CommunicationChannel.SMS;
    const isCritical = formData.eventType.includes("Critical") || formData.eventType.includes("Alert");

    const consentVal = PreferenceEngine.evaluateConsent(pref, channel, isCritical);
    if (!consentVal.isAllowed) {
      await this.audit(eventId, channel, "SUPPRESSED", formData.recipientPhone || formData.recipientId, CommunicationStatus.FAILED);
      return { eventId, status: "SUPPRESSED", reason: consentVal.reason };
    }

    // 2. Fetch Notification Template
    let template = await this.templateRepo.getByCode(formData.eventType);
    if (!template) {
      template = {
        id: `tpl-${formData.eventType}`,
        code: formData.eventType,
        name: formData.eventType,
        channel,
        category: NotificationCategory.OPERATIONS,
        bodyTemplate: `Notification for {{eventType}}: {{bookingId}}`,
        version: 1,
        status: TemplateStatus.ACTIVE,
        createdAt: now,
        updatedAt: now,
      };
    }

    // 3. Render Template
    const variables: Record<string, string> = { eventType: formData.eventType };
    Object.entries(formData.payload).forEach(([k, v]) => {
      variables[k] = String(v);
    });

    const { renderedSubject, renderedBody } = TemplateEngine.renderTemplate(template, variables);

    // 4. Dispatch via NotificationEngine
    const reqId = doc(collection(this.db, "communication_requests")).id;
    const request: CommunicationRequest = {
      id: reqId,
      eventId,
      recipientId: formData.recipientId,
      recipientContact: formData.recipientPhone || formData.recipientEmail || formData.recipientId,
      channel,
      priority: isCritical ? CommunicationPriority.CRITICAL : CommunicationPriority.NORMAL,
      templateCode: template.code,
      variables,
      status: CommunicationStatus.QUEUED,
      retryCount: 0,
      maxRetries: 2,
      fallbackChannel: CommunicationChannel.EMAIL,
      createdAt: now,
    };

    const dispatchResult = await NotificationEngine.dispatchRequest(request, renderedBody, renderedSubject);
    await this.audit(reqId, channel, dispatchResult.providerName, request.recipientContact, dispatchResult.status);

    return { eventId, status: dispatchResult.status };
  }

  // ── Template & Preference APIs ──────────────────────────────────────────

  async createTemplate(formData: CreateTemplateFormData): Promise<NotificationTemplate> {
    const val = validateTemplateCreation(formData);
    if (!val.isValid) throw new Error(`Validation failed: ${JSON.stringify(val.errors)}`);

    const id = doc(collection(this.db, "notification_templates")).id;
    const now = serverTimestamp() as unknown as Timestamp;

    const template: NotificationTemplate = {
      id,
      code: formData.code,
      name: formData.name,
      channel: formData.channel,
      category: formData.category,
      subjectTemplate: formData.subjectTemplate,
      bodyTemplate: formData.bodyTemplate,
      version: 1,
      status: TemplateStatus.ACTIVE,
      createdAt: now,
      updatedAt: now,
    };

    await this.templateRepo.create(template);
    return template;
  }

  async updatePreferences(formData: UpdatePreferencesFormData): Promise<NotificationPreference> {
    const now = serverTimestamp() as unknown as Timestamp;
    const pref: NotificationPreference = {
      userId: formData.userId,
      smsConsent: formData.smsConsent ? ConsentStatus.OPTED_IN : ConsentStatus.OPTED_OUT,
      whatsappConsent: formData.whatsappConsent ? ConsentStatus.OPTED_IN : ConsentStatus.OPTED_OUT,
      emailConsent: formData.emailConsent ? ConsentStatus.OPTED_IN : ConsentStatus.OPTED_OUT,
      pushConsent: formData.pushConsent ? ConsentStatus.OPTED_IN : ConsentStatus.OPTED_OUT,
      quietHoursStart: formData.quietHoursStart ?? null,
      quietHoursEnd: formData.quietHoursEnd ?? null,
      updatedAt: now,
    };

    await this.prefRepo.savePreference(pref);
    return pref;
  }

  async getPreferences(userId: string): Promise<NotificationPreference | null> {
    return this.prefRepo.getPreference(userId);
  }
}
