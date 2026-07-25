// apps/web/lib/providerOfferings/services/ProviderOfferingService.ts

/**
 * Service layer for Provider Offerings.
 * Encapsulates domain logic for creating, updating, publishing, archiving, restoring,
 * and soft-deleting diagnostic service offerings.
 *
 * This class must never be imported directly into React components – use hooks instead.
 */

import { collection, doc, getFirestore, serverTimestamp } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import {
  ProviderOfferingRepository,
  OfferingSearchFilters,
} from "../repositories/ProviderOfferingRepository";
import { ProviderOffering, PriceConfiguration } from "../models/types";
import { ProviderOfferingStatus } from "../models/enums";
import { ProviderOfferingFormData } from "../models/form";
import {
  validateProviderOffering,
  isValidStatusTransition,
} from "../validation/validateProviderOffering";
import type { DocumentSnapshot } from "firebase/firestore";

// ---------------------------------------------------------------------------
// Role definitions
// ---------------------------------------------------------------------------

/**
 * Application roles used for permission checks.
 */
export type AppRole = "SuperAdmin" | "Admin" | "Editor" | "Viewer";

/** Roles authorized to publish, archive, or restore offerings. */
const PUBLISH_ARCHIVE_ROLES: AppRole[] = ["SuperAdmin", "Admin", "Editor"];

/** Roles authorized to soft-delete offerings. */
const DELETE_ROLES: AppRole[] = ["SuperAdmin", "Admin"];

// ---------------------------------------------------------------------------
// Helper types & dictionary
// ---------------------------------------------------------------------------

/**
 * Snapshot of denormalized parent entity fields stored inside each offering
 * to support efficient single-collection queries.
 */
export interface OfferingParentSnapshot {
  providerBrandName: string;
  providerName: string;
  providerCode: string;
  serviceName: string;
  serviceCode: string;
  categoryId: string;
}

/** Dictionary mapping common clinical & diagnostic abbreviations to expansion tokens. */
const COMMON_ABBREVIATIONS: Record<string, string[]> = {
  mri: ["magnetic", "resonance", "imaging"],
  ct: ["computed", "tomography", "scan"],
  cbct: ["cone", "beam", "computed", "tomography"],
  usg: ["ultrasound", "ultrasonography", "sonography"],
  ecg: ["electrocardiogram", "electrocardiography", "ekg"],
  eeg: ["electroencephalogram", "electroencephalography"],
  echo: ["echocardiogram", "echocardiography"],
  xray: ["radiograph", "radiology"],
  cbc: ["complete", "blood", "count"],
  lft: ["liver", "function", "test"],
  kft: ["kidney", "renal", "function", "test"],
  tft: ["thyroid", "function", "test"],
  pet: ["positron", "emission", "tomography"],
  dexa: ["bone", "density", "densitometry"],
};

// ---------------------------------------------------------------------------
// Service Implementation
// ---------------------------------------------------------------------------

export class ProviderOfferingService {
  private repo = new ProviderOfferingRepository();
  private db = getFirestore();

  // ── Internal helpers ────────────────────────────────────────────────────

  /**
   * Generates Firestore-safe search keywords from parent entity metadata, display names,
   * codes, categories, and medical abbreviations.
   *
   * Normalizes tokens to lowercase, trims whitespace, expands common medical abbreviations,
   * and deduplicates results. Users must never edit searchKeywords manually.
   *
   * @param snapshot - Denormalized parent entity metadata.
   * @param displayName - Optional display name override.
   * @returns Array of unique, normalized search keywords.
   */
  public generateSearchKeywords(
    snapshot: OfferingParentSnapshot,
    displayName?: string
  ): string[] {
    const rawInputs = [
      snapshot.providerBrandName,
      snapshot.providerName,
      snapshot.providerCode,
      snapshot.serviceName,
      snapshot.serviceCode,
      snapshot.categoryId,
      displayName ?? "",
    ];

    const tokens: string[] = [];

    for (const input of rawInputs) {
      if (!input) continue;
      const parts = input
        .toLowerCase()
        .split(/[\s,._/-]+/)
        .map((t) => t.trim())
        .filter((t) => t.length >= 2);

      for (const token of parts) {
        tokens.push(token);
        if (COMMON_ABBREVIATIONS[token]) {
          tokens.push(...COMMON_ABBREVIATIONS[token]);
        }
      }
    }

    return [...new Set(tokens)];
  }

  /**
   * Asserts that a user role is authorized for the requested action.
   * Throws an Error if unauthorized.
   */
  private assertRole(userRole: AppRole, allowedRoles: AppRole[], action: string): void {
    if (!allowedRoles.includes(userRole)) {
      throw new Error(
        `Permission denied: role '${userRole}' is not authorized to ${action}. ` +
          `Required roles: ${allowedRoles.join(", ")}`
      );
    }
  }

  // ── Public API ──────────────────────────────────────────────────────────

  /**
   * Fetches a single Provider Offering by document ID.
   * Returns null if the offering does not exist or has been soft-deleted.
   *
   * @param id - Document ID of the offering.
   */
  async getOffering(id: string): Promise<ProviderOffering | null> {
    return this.repo.getById(id);
  }

  /**
   * Searches and lists offerings with cursor-based pagination.
   *
   * @param filters - Search and filter parameters.
   * @param pageSize - Page size limit (default: 20).
   * @param cursor - Firestore DocumentSnapshot cursor for pagination.
   */
  async listOfferings(
    filters: OfferingSearchFilters = {},
    pageSize = 20,
    cursor?: DocumentSnapshot
  ): Promise<{ offerings: ProviderOffering[]; nextCursor?: DocumentSnapshot }> {
    return this.repo.search(filters, pageSize, cursor);
  }

  /**
   * Creates a new Provider Offering in Draft status with version initialized to 1.
   *
   * Validation rules enforced:
   *  - providerLocationId and diagnosticServiceId are non-empty.
   *  - Pricing rules (mrp >= 0, sellingPrice <= mrp, memberPrice/offerPrice constraints).
   *  - Availability consistency (onlineBookable requires enabled = true).
   *  - Duplicate prevention (no existing active offering for providerLocationId + diagnosticServiceId).
   *  - Version is initialized to 1.
   *  - searchKeywords are automatically generated.
   *
   * @param providerLocationId - Parent branch location ID.
   * @param diagnosticServiceId - Catalog service ID.
   * @param formData - User input form data.
   * @param parentSnapshot - Denormalized parent metadata.
   * @param userId - ID of the actor creating the offering.
   * @returns Newly created ProviderOffering.
   */
  async createOffering(
    providerLocationId: string,
    diagnosticServiceId: string,
    formData: ProviderOfferingFormData,
    parentSnapshot: OfferingParentSnapshot,
    userId: string
  ): Promise<ProviderOffering> {
    if (!providerLocationId?.trim()) throw new Error("providerLocationId is required");
    if (!diagnosticServiceId?.trim()) throw new Error("diagnosticServiceId is required");

    const valResult = validateProviderOffering(formData);
    if (!valResult.isValid) {
      throw new Error(`Offering validation failed: ${JSON.stringify(valResult.errors)}`);
    }

    const isDuplicate = await this.repo.existsDuplicate(providerLocationId, diagnosticServiceId);
    if (isDuplicate) {
      throw new Error(
        `An active offering already exists for providerLocationId='${providerLocationId}' ` +
          `and diagnosticServiceId='${diagnosticServiceId}'. ` +
          `Archive the existing offering before creating a new one.`
      );
    }

    const id = doc(collection(this.db, "provider_offerings")).id;
    const now = serverTimestamp() as unknown as Timestamp;
    const keywords = this.generateSearchKeywords(parentSnapshot, formData.displayNameOverride);

    const offering: ProviderOffering = {
      id,
      version: 1, // Default schema version initialized to 1
      providerLocationId,
      diagnosticServiceId,
      priceConfiguration: { ...formData.priceConfiguration },
      status: ProviderOfferingStatus.Draft, // Always begins in Draft state
      availability: { ...formData.availability },
      homeCollectionSupported: formData.homeCollectionSupported,
      reportTatOverrideHours: formData.reportTatOverrideHours,
      durationOverrideMinutes: formData.durationOverrideMinutes,
      notes: formData.notes,
      displayOrder: formData.displayOrder,
      displayNameOverride: formData.displayNameOverride,
      providerBrandName: parentSnapshot.providerBrandName,
      searchKeywords: keywords,
      lastPriceUpdatedAt: now,
      createdBy: userId,
      updatedBy: userId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      deletedBy: null,
    };

    await this.repo.create(offering);
    return offering;
  }

  /**
   * Updates an existing Provider Offering.
   *
   * Enforces immutability of FKs and status (status changes must use lifecycle methods).
   * Updates lastPriceUpdatedAt if pricing changed.
   * Preserves version number unless explicitly incremented by migration tools.
   *
   * @param id - Document ID of target offering.
   * @param formData - Updated form values.
   * @param parentSnapshot - Updated denormalized parent snapshot.
   * @param userId - ID of actor updating the offering.
   */
  async updateOffering(
    id: string,
    formData: Partial<ProviderOfferingFormData>,
    parentSnapshot: OfferingParentSnapshot,
    userId: string
  ): Promise<void> {
    const existing = await this.repo.getById(id);
    if (!existing) throw new Error(`Offering '${id}' not found`);

    const mergedPrice: PriceConfiguration = {
      ...existing.priceConfiguration,
      ...(formData.priceConfiguration ?? {}),
    };

    const mergedForm: ProviderOfferingFormData = {
      priceConfiguration: mergedPrice,
      availability: { ...existing.availability, ...(formData.availability ?? {}) },
      homeCollectionSupported: formData.homeCollectionSupported ?? existing.homeCollectionSupported,
      reportTatOverrideHours: formData.reportTatOverrideHours ?? existing.reportTatOverrideHours,
      durationOverrideMinutes: formData.durationOverrideMinutes ?? existing.durationOverrideMinutes,
      notes: formData.notes ?? existing.notes,
      displayOrder: formData.displayOrder ?? existing.displayOrder,
      displayNameOverride: formData.displayNameOverride ?? existing.displayNameOverride,
      status: existing.status,
    };

    const valResult = validateProviderOffering(mergedForm);
    if (!valResult.isValid) {
      throw new Error(`Offering validation failed: ${JSON.stringify(valResult.errors)}`);
    }

    const priceChanged =
      JSON.stringify(existing.priceConfiguration) !== JSON.stringify(mergedPrice);

    const now = serverTimestamp() as unknown as Timestamp;
    const keywords = this.generateSearchKeywords(
      parentSnapshot,
      mergedForm.displayNameOverride
    );

    const updated: ProviderOffering = {
      ...existing,
      version: existing.version ?? 1,
      priceConfiguration: mergedPrice,
      availability: mergedForm.availability,
      homeCollectionSupported: mergedForm.homeCollectionSupported,
      reportTatOverrideHours: mergedForm.reportTatOverrideHours,
      durationOverrideMinutes: mergedForm.durationOverrideMinutes,
      notes: mergedForm.notes,
      displayOrder: mergedForm.displayOrder,
      displayNameOverride: mergedForm.displayNameOverride,
      providerBrandName: parentSnapshot.providerBrandName,
      searchKeywords: keywords,
      lastPriceUpdatedAt: priceChanged ? now : existing.lastPriceUpdatedAt,
      updatedBy: userId,
      updatedAt: now,
    };

    await this.repo.update(updated);
  }

  /**
   * Core status lifecycle transition method.
   * Enforces transition rules (Draft -> Published -> Archived -> Draft) and role authorization.
   *
   * @param id - Document ID of target offering.
   * @param newStatus - Desired target status.
   * @param userId - ID of actor requesting transition.
   * @param userRole - Role of actor requesting transition.
   */
  async transitionStatus(
    id: string,
    newStatus: ProviderOfferingStatus,
    userId: string,
    userRole: AppRole
  ): Promise<void> {
    this.assertRole(userRole, PUBLISH_ARCHIVE_ROLES, `set status to '${newStatus}'`);

    const existing = await this.repo.getById(id);
    if (!existing) throw new Error(`Offering '${id}' not found`);

    if (!isValidStatusTransition(existing.status, newStatus)) {
      throw new Error(
        `Invalid status transition: '${existing.status}' → '${newStatus}'. ` +
          `Allowed transitions: Draft → Published, Published → Archived, Archived → Draft.`
      );
    }

    const now = serverTimestamp() as unknown as Timestamp;
    await this.repo.update({
      ...existing,
      status: newStatus,
      updatedBy: userId,
      updatedAt: now,
    });
  }

  /**
   * Explicit business method to publish an offering (Draft -> Published).
   * Calls transitionStatus internally.
   *
   * @param id - Offering document ID.
   * @param userId - User ID of actor.
   * @param userRole - Role of actor.
   */
  async publishOffering(id: string, userId: string, userRole: AppRole): Promise<void> {
    return this.transitionStatus(id, ProviderOfferingStatus.Published, userId, userRole);
  }

  /**
   * Explicit business method to archive an offering (Published -> Archived).
   * Calls transitionStatus internally.
   *
   * @param id - Offering document ID.
   * @param userId - User ID of actor.
   * @param userRole - Role of actor.
   */
  async archiveOffering(id: string, userId: string, userRole: AppRole): Promise<void> {
    return this.transitionStatus(id, ProviderOfferingStatus.Archived, userId, userRole);
  }

  /**
   * Explicit business method to restore an archived offering back to Draft (Archived -> Draft).
   * Calls transitionStatus internally.
   *
   * @param id - Offering document ID.
   * @param userId - User ID of actor.
   * @param userRole - Role of actor.
   */
  async restoreOffering(id: string, userId: string, userRole: AppRole): Promise<void> {
    return this.transitionStatus(id, ProviderOfferingStatus.Draft, userId, userRole);
  }

  /**
   * Soft-deletes a Provider Offering.
   * Requires SuperAdmin or Admin role.
   *
   * @param id - Document ID of offering to soft-delete.
   * @param userId - User ID of actor.
   * @param userRole - Role of actor.
   */
  async deleteOffering(id: string, userId: string, userRole: AppRole): Promise<void> {
    this.assertRole(userRole, DELETE_ROLES, "delete an offering");

    const existing = await this.repo.getById(id);
    if (!existing) throw new Error(`Offering '${id}' not found`);

    await this.repo.softDelete(id, userId);
  }
}
