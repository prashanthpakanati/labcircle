// apps/web/lib/imaging/models/form.ts

import { CatalogStatus } from "./enums";
import { ImagingCategory, ImagingService, ServicePreparation } from "./types";

/**
 * Writeable payload interface for creating/updating a category.
 * Note: 'code' must become read-only in editing forms after creation.
 */
export interface CategoryFormData {
  parentId: string | null;
  code: string;
  name: string;
  description: string;
  icon: string;
  displayOrder: number;
  status: CatalogStatus;
}

/**
 * Writeable payload interface for creating/updating an imaging service.
 * Note: 'serviceCode' must become read-only in editing forms after creation.
 */
export interface ServiceFormData {
  categoryId: string;
  slug: string;
  serviceCode: string;
  serviceName: string;
  aliases: string[];
  description: string;
  modality: string;
  bodyPart: string;
  durationMinutes: number;
  reportTatHours: number;
  thumbnail: string;
  featured: boolean;
  popular: boolean;
  preparation: ServicePreparation;
  status: CatalogStatus;
  keywords: string[];
}

/**
 * ImagingMapper – serialisation and deserialisation maps between domain models
 * and Firestore records, maintaining clean schema boundaries.
 */
export const ImagingMapper = {
  /** Convert category domain model to a Firestore-safe plain record */
  toCategoryFirestore(cat: ImagingCategory): Record<string, unknown> {
    return {
      id: cat.id,
      parentId: cat.parentId ?? null,
      code: cat.code,
      name: cat.name,
      description: cat.description ?? "",
      icon: cat.icon ?? "Scan",
      displayOrder: cat.displayOrder ?? 0,
      status: cat.status ?? CatalogStatus.Draft,
      createdBy: cat.createdBy,
      updatedBy: cat.updatedBy,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
      deletedAt: cat.deletedAt ?? null,
      deletedBy: cat.deletedBy ?? null,
    };
  },

  /** Map raw Firestore record to hierarchical category domain model */
  fromCategoryFirestore(data: Record<string, unknown>): ImagingCategory {
    return {
      id: (data.id as string) || "",
      parentId: (data.parentId as string) || null,
      code: (data.code as string) || "",
      name: (data.name as string) || "",
      description: (data.description as string) || "",
      icon: (data.icon as string) || "Scan",
      displayOrder: typeof data.displayOrder === "number" ? data.displayOrder : 0,
      status: (data.status as CatalogStatus) || CatalogStatus.Draft,
      createdBy: (data.createdBy as string) || "",
      updatedBy: (data.updatedBy as string) || "",
      createdAt: (data.createdAt as string) || new Date().toISOString(),
      updatedAt: (data.updatedAt as string) || new Date().toISOString(),
      deletedAt: (data.deletedAt as string) || null,
      deletedBy: (data.deletedBy as string) || null,
    };
  },

  /** Convert service domain model to a Firestore-safe plain record */
  toServiceFirestore(service: ImagingService): Record<string, unknown> {
    return {
      id: service.id,
      categoryId: service.categoryId,
      slug: service.slug,
      serviceCode: service.serviceCode,
      serviceName: service.serviceName,
      aliases: service.aliases ?? [],
      description: service.description ?? "",
      modality: service.modality,
      bodyPart: service.bodyPart,
      durationMinutes: service.durationMinutes ?? 30,
      reportTatHours: service.reportTatHours ?? 24,
      thumbnail: service.thumbnail ?? "",
      featured: service.featured ?? false,
      popular: service.popular ?? false,
      keywords: service.keywords ?? [],
      preparation: {
        fastingRequired: service.preparation?.fastingRequired ?? false,
        fastingHours: service.preparation?.fastingHours ?? 0,
        waterAllowed: service.preparation?.waterAllowed ?? true,
        contrastRequired: service.preparation?.contrastRequired ?? false,
        removeMetalObjects: service.preparation?.removeMetalObjects ?? false,
        pregnancyWarning: service.preparation?.pregnancyWarning ?? false,
        medicationInstructions: service.preparation?.medicationInstructions ?? "",
        documentRequirements: service.preparation?.documentRequirements ?? [],
        additionalInstructions: service.preparation?.additionalInstructions ?? "",
      },
      status: service.status ?? CatalogStatus.Draft,
      createdBy: service.createdBy,
      updatedBy: service.updatedBy,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
      deletedAt: service.deletedAt ?? null,
      deletedBy: service.deletedBy ?? null,
    };
  },

  /** Map raw Firestore record to diagnostics service domain model */
  fromServiceFirestore(data: Record<string, unknown>): ImagingService {
    const rawPrep = (data.preparation as Record<string, unknown>) || {};
    return {
      id: (data.id as string) || "",
      categoryId: (data.categoryId as string) || "",
      slug: (data.slug as string) || "",
      serviceCode: (data.serviceCode as string) || "",
      serviceName: (data.serviceName as string) || "",
      aliases: Array.isArray(data.aliases) ? (data.aliases as string[]) : [],
      description: (data.description as string) || "",
      modality: (data.modality as string) || "",
      bodyPart: (data.bodyPart as string) || "",
      durationMinutes: typeof data.durationMinutes === "number" ? data.durationMinutes : 30,
      reportTatHours: typeof data.reportTatHours === "number" ? data.reportTatHours : 24,
      thumbnail: (data.thumbnail as string) || "",
      featured: typeof data.featured === "boolean" ? data.featured : false,
      popular: typeof data.popular === "boolean" ? data.popular : false,
      keywords: Array.isArray(data.keywords) ? (data.keywords as string[]) : [],
      preparation: {
        fastingRequired: typeof rawPrep.fastingRequired === "boolean" ? rawPrep.fastingRequired : false,
        fastingHours: typeof rawPrep.fastingHours === "number" ? rawPrep.fastingHours : undefined,
        waterAllowed: typeof rawPrep.waterAllowed === "boolean" ? rawPrep.waterAllowed : true,
        contrastRequired: typeof rawPrep.contrastRequired === "boolean" ? rawPrep.contrastRequired : false,
        removeMetalObjects: typeof rawPrep.removeMetalObjects === "boolean" ? rawPrep.removeMetalObjects : false,
        pregnancyWarning: typeof rawPrep.pregnancyWarning === "boolean" ? rawPrep.pregnancyWarning : false,
        medicationInstructions: (rawPrep.medicationInstructions as string) || undefined,
        documentRequirements: Array.isArray(rawPrep.documentRequirements) ? (rawPrep.documentRequirements as string[]) : undefined,
        additionalInstructions: (rawPrep.additionalInstructions as string) || undefined,
      },
      status: (data.status as CatalogStatus) || CatalogStatus.Draft,
      createdBy: (data.createdBy as string) || "",
      updatedBy: (data.updatedBy as string) || "",
      createdAt: (data.createdAt as string) || new Date().toISOString(),
      updatedAt: (data.updatedAt as string) || new Date().toISOString(),
      deletedAt: (data.deletedAt as string) || null,
      deletedBy: (data.deletedBy as string) || null,
    };
  },
};
