// apps/web/lib/imaging/models/types.ts

import { CatalogStatus } from "./enums";

/**
 * Structured preparation instructions for patients before undergoing a diagnostic service.
 */
export interface ServicePreparation {
  fastingRequired: boolean;
  fastingHours?: number;
  waterAllowed: boolean;
  contrastRequired: boolean;
  removeMetalObjects: boolean;
  pregnancyWarning: boolean;
  medicationInstructions?: string;
  documentRequirements?: string[]; // e.g. ["Doctor's Prescription", "Previous Scans"]
  additionalInstructions?: string;
}

/**
 * Represents a hierarchical diagnostic/imaging category.
 * Supports parent-child relationships via parentId, soft delete, and audit metadata.
 */
export interface ImagingCategory {
  id: string;
  parentId: string | null;  // Null indicates a top-level category (e.g. "Diagnostic Imaging")
  code: string;            // Unique code (e.g. "MRI", "CT-SCAN", "ULTRASOUND"). Immutable after creation.
  name: string;            // E.g. "MRI Scan", "Ultrasound"
  description: string;
  icon: string;            // Lucide icon name representation string
  displayOrder: number;
  status: CatalogStatus;   // Draft, Published, Archived

  // Audit Fields
  createdBy: string;       // User UID
  updatedBy: string;       // User UID
  createdAt: string;       // ISO-8601 string
  updatedAt: string;       // ISO-8601 string

  // Soft Delete Support
  deletedAt?: string | null; // ISO-8601 string or null if not deleted
  deletedBy?: string | null; // User UID or null if not deleted
}

/**
 * Represents a predefined diagnostic/imaging service catalog item.
 * Extensible design structure that maps to generic diagnostics in the future.
 */
export interface ImagingService {
  id: string;
  categoryId: string;            // Links to ImagingCategory
  slug: string;                  // URL friendly identifier (e.g., "mri-brain")
  serviceCode: string;           // Unique identifier (e.g., "MRI-BRAIN"). Immutable after creation.
  serviceName: string;           // E.g. "MRI Brain"
  aliases: string[];             // Synonyms for search match flexibility
  description: string;
  modality: string;              // E.g. "MRI", "CT", "X-Ray", "Ultrasound"
  bodyPart: string;              // E.g. "Brain", "Spine", "Knee", "Chest"
  durationMinutes: number;       // Average scan duration in minutes
  reportTatHours: number;        // Average turnaround time in hours
  thumbnail: string;             // URL/path to catalog card display thumbnail
  featured: boolean;             // Highlighted service
  popular: boolean;              // Commonly booked service
  keywords: string[];            // Search keywords/tags
  preparation: ServicePreparation; // Extensible patient preparation object
  status: CatalogStatus;         // Draft, Published, Archived

  // Audit Fields
  createdBy: string;             // User UID
  updatedBy: string;             // User UID
  createdAt: string;             // ISO-8601 string
  updatedAt: string;             // ISO-8601 string

  // Soft Delete Support
  deletedAt?: string | null;     // ISO-8601 string or null if not deleted
  deletedBy?: string | null;     // User UID or null if not deleted
}
