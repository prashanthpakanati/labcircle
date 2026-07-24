// apps/web/lib/imaging/models/types.ts

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
 * Supports parent-child relationships via parentId.
 */
export interface ImagingCategory {
  id: string;
  parentId: string | null; // Null indicates a top-level category (e.g. "Diagnostic Imaging")
  code: string;           // Unique code (e.g. "MRI", "CT-SCAN", "ULTRASOUND")
  name: string;           // E.g. "MRI Scan", "Ultrasound"
  description: string;
  icon: string;           // Lucide icon name representation string
  displayOrder: number;
  active: boolean;
  createdAt: string;      // ISO-8601 string
  updatedAt: string;      // ISO-8601 string
}

/**
 * Represents a predefined diagnostic/imaging service catalog item.
 * Extensible design structure that maps to generic diagnostics in the future.
 */
export interface ImagingService {
  id: string;
  categoryId: string;            // Links to ImagingCategory
  slug: string;                  // URL friendly identifier (e.g., "mri-brain")
  serviceCode: string;           // Unique identifier (e.g., "MRI-BRAIN")
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
  active: boolean;
  createdAt: string;             // ISO-8601 string
  updatedAt: string;             // ISO-8601 string
}
