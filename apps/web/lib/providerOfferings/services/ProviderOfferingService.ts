// apps/web/lib/providerOfferings/services/ProviderOfferingService.ts

/**
 * Service layer for Provider Offerings.
 * Contains ALL business logic for creating, updating, archiving, restoring,
 * and deleting Provider Offerings.
 *
 * This class must never be called from UI components directly – only via hooks.
 */

import { collection, doc, getFirestore, serverTimestamp } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { ProviderOfferingRepository, OfferingSearchFilters } from "../repositories/ProviderOfferingRepository";
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
 * Extend this union as new roles are introduced.
 */
export type AppRole = "SuperAdmin" | "Admin" | "Editor" | "Viewer";

/** Roles that may publish or archive offerings. */
const PUBLISH_ARCHIVE_ROLES: AppRole[] = ["SuperAdmin", "Admin", "Editor"];

/** Roles that may soft‑delete offerings. */
const DELETE_ROLES: AppRole[] = ["SuperAdmin", "Admin"];

// ---------------------------------------------------------------------------
// Helper types
// ---------------------------------------------------------------------------

/**
 * Snapshot of denormalized parent entity fields stored inside each offering
 * to support efficient single‑collection searches.
 */
export interface OfferingParentSnapshot {
  providerBrandName: string;
  providerName: string;
  providerCode: string;
  serviceName: string;
  serviceCode: string;
  categoryId: string;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class ProviderOfferingService {
  private repo = new ProviderOfferingRepository();
  private db = getFirestore();

  // ── Internal helpers ────────────────────────────────────────────────────

  /**
   * Generate Firestore‑safe search keywords from string tokens.
   * Produces lower‑cased, trimmed, deduplicated tokens suitable for
   * Firestore `array-contains-any` queries.
   * Users must never edit this field directly.
   */
  private generateSearchKeywords(snapshot: OfferingParentSnapshot, displayName?: string): string[] {
    const raw = [
      snapshot.providerBrandName,
      snapshot.providerName,
      snapshot.providerCode,
      snapshot.serviceName,
      snapshot.serviceCode,
      snapshot.categoryId,
      displayName ?? "",
    ]
      .join(" ")
      .toLowerCase()
      .split(/[\s,._/-]+/)
      .map((t) => t.trim())
      .filter((t) => t.length >= 2);

    return [...new Set(raw)];
  }

  /**
   * Assert that a user role is authorized for the requested action.
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
   * Fetch a single offering by ID.
   * Returns null if the offering does not exist or has been soft‑deleted.
   */
  async getOffering(id: string): Promise<ProviderOffering | null> {
    return this.repo.getById(id);
  }

  /**
   * Search / list offerings with cursor‑based pagination.
   *
   * @param filters   - Search filters (provider, service, status, price range, etc.)
   * @param pageSize  - Number of results per page (default 20).
   * @param cursor    - Firestore DocumentSnapshot cursor for the next page.
   */
  async listOfferings(
    filters: OfferingSearchFilters = {},
    pageSize = 20,
    cursor?: DocumentSnapshot
  ): Promise<{ offerings: ProviderOffering[]; nextCursor?: DocumentSnapshot }> {
    return this.repo.search(filters, pageSize, cursor);
  }

  /**
   * Create a new Provider Offering.
   *
   * Validation rules enforced:
   *  - ProviderLocation and DiagnosticService references are provided (non‑empty).
   *  - Pricing constraints (mrp >= 0, sellingPrice <= mrp, etc.).
   *  - Availability consistency (onlineBookable requires enabled = true).
   *  - No duplicate active offering exists for the same (providerLocationId, diagnosticServiceId) pair.
   *  - Audit fields are set automatically.
   *  - searchKeywords are generated automatically.
   *  - Status defaults to Draft.
   *
   * @param providerLocationId - FK to the parent ProviderLocation.
   * @param diagnosticServiceId - FK to the DiagnosticService catalog entry.
   * @param formData - User‑supplied form values.
   * @param parentSnapshot - Denormalized fields copied from parent entities.
   * @param userId - UID of the authenticated user performing the action.
   * @returns The newly created ProviderOffering.
   */
  async createOffering(
    providerLocationId: string,
    diagnosticServiceId: string,
    formData: ProviderOfferingFormData,
    parentSnapshot: OfferingParentSnapshot,
    userId: string
  ): Promise<ProviderOffering> {
    // 1. Validate FK presence
    if (!providerLocationId?.trim()) throw new Error("providerLocationId is required");
    if (!diagnosticServiceId?.trim()) throw new Error("diagnosticServiceId is required");

    // 2. Validate form data
    const valResult = validateProviderOffering(formData);
    if (!valResult.isValid) {
      throw new Error(`Offering validation failed: ${JSON.stringify(valResult.errors)}`);
    }

    // 3. Duplicate prevention — archived and soft‑deleted offerings are ignored
    const isDuplicate = await this.repo.existsDuplicate(providerLocationId, diagnosticServiceId);
    if (isDuplicate) {
      throw new Error(
        `An active offering already exists for providerLocationId='${providerLocationId}' ` +
          `and diagnosticServiceId='${diagnosticServiceId}'. ` +
          `Archive the existing offering before creating a new one.`
      );
    }

    // 4. Build entity
    const id = doc(collection(this.db, "provider_offerings")).id;
    const now = serverTimestamp() as unknown as Timestamp;
    const keywords = this.generateSearchKeywords(parentSnapshot, formData.displayNameOverride);

    const offering: ProviderOffering = {
      id,
      providerLocationId,
      diagnosticServiceId,
      priceConfiguration: { ...formData.priceConfiguration },
      status: ProviderOfferingStatus.Draft, // always starts as Draft
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
   * Update an existing offering.
   *
   * Business rules enforced:
   *  - Offering must exist and not be soft‑deleted.
   *  - providerLocationId and diagnosticServiceId are immutable.
   *  - Status changes are rejected here — use transitionStatus instead.
   *  - Pricing changes update lastPriceUpdatedAt.
   *  - searchKeywords are regenerated automatically.
   *
   * @param id - Offering document ID.
   * @param formData - Updated form values.
   * @param parentSnapshot - Updated denormalized parent snapshot (pass existing if unchanged).
   * @param userId - UID of the authenticated user.
   */
  async updateOffering(
    id: string,
    formData: Partial<ProviderOfferingFormData>,
    parentSnapshot: OfferingParentSnapshot,
    userId: string
  ): Promise<void> {
    const existing = await this.repo.getById(id);
    if (!existing) throw new Error(`Offering '${id}' not found`);

    // Merge and validate pricing
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
      status: existing.status, // status must be changed via transitionStatus
    };

    const valResult = validateProviderOffering(mergedForm);
    if (!valResult.isValid) {
      throw new Error(`Offering validation failed: ${JSON.stringify(valResult.errors)}`);
    }

    // Only update lastPriceUpdatedAt if pricing actually changed
    const priceChanged =
      JSON.stringify(existing.priceConfiguration) !== JSON.stringify(mergedPrice);

    const now = serverTimestamp() as unknown as Timestamp;
    const keywords = this.generateSearchKeywords(
      parentSnapshot,
      mergedForm.displayNameOverride
    );

    const updated: ProviderOffering = {
      ...existing,
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
   * Transition an offering through its status lifecycle.
   *
   * Allowed transitions:
   *  Draft → Published (requires PUBLISH_ARCHIVE_ROLES)
   *  Published → Archived (requires PUBLISH_ARCHIVE_ROLES)
   *  Archived → Draft    (restore; requires PUBLISH_ARCHIVE_ROLES)
   *
   * @param id - Offering document ID.
   * @param newStatus - Target status.
   * @param userId - UID of the authenticated user.
   * @param userRole - Role of the authenticated user.
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
   * Archive an offering (convenience wrapper around transitionStatus).
   */
  async archiveOffering(id: string, userId: string, userRole: AppRole): Promise<void> {
    return this.transitionStatus(id, ProviderOfferingStatus.Archived, userId, userRole);
  }

  /**
   * Restore an archived offering back to Draft status.
   */
  async restoreOffering(id: string, userId: string, userRole: AppRole): Promise<void> {
    return this.transitionStatus(id, ProviderOfferingStatus.Draft, userId, userRole);
  }

  /**
   * Soft‑delete an offering.
   * Sets deletedAt and deletedBy; the document remains in Firestore.
   * Soft‑deleted offerings are excluded from all read operations.
   *
   * Requires SuperAdmin or Admin role.
   *
   * @param id - Offering document ID.
   * @param userId - UID of the authenticated user.
   * @param userRole - Role of the authenticated user.
   */
  async deleteOffering(id: string, userId: string, userRole: AppRole): Promise<void> {
    this.assertRole(userRole, DELETE_ROLES, "delete an offering");

    const existing = await this.repo.getById(id);
    if (!existing) throw new Error(`Offering '${id}' not found`);

    await this.repo.softDelete(id, userId);
  }
}
