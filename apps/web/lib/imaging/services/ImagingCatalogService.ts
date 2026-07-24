// apps/web/lib/imaging/services/ImagingCatalogService.ts

import { doc, collection, getFirestore } from "firebase/firestore";
import { ImagingCategoryRepository } from "../repositories/ImagingCategoryRepository";
import { ImagingServiceRepository } from "../repositories/ImagingServiceRepository";
import { ImagingCategory, ImagingService } from "../models/types";
import { CategoryFormData, ServiceFormData } from "../models/form";
import { validateCategory } from "../validation/validateCategory";
import { validateService } from "../validation/validateService";
import { CatalogStatus } from "../models/enums";

export class ImagingCatalogService {
  private categoryRepo = new ImagingCategoryRepository();
  private serviceRepo = new ImagingServiceRepository();
  private db = getFirestore();

  /** Fetch all categories (patient vs admin view depends on status & includeDeleted parameters) */
  async getCategories(options?: { isAdmin?: boolean; includeDeleted?: boolean }): Promise<ImagingCategory[]> {
    let categories = await this.categoryRepo.listCategories(options?.includeDeleted);
    
    if (!options?.isAdmin) {
      categories = categories.filter((c) => c.status === CatalogStatus.Published);
    }
    return categories;
  }

  /** Fetch single category by ID */
  async getCategory(id: string): Promise<ImagingCategory | null> {
    return this.categoryRepo.getCategory(id);
  }

  /** Create a new category with full audit metadata */
  async createCategory(formData: CategoryFormData, userId: string): Promise<ImagingCategory> {
    const valResult = validateCategory(formData);
    if (!valResult.isValid) {
      throw new Error(`Category validation failed: ${JSON.stringify(valResult.errors)}`);
    }

    const id = doc(collection(this.db, "dummy")).id; // generate secure Firestore doc ID
    const now = new Date().toISOString();

    const category: ImagingCategory = {
      id,
      parentId: formData.parentId,
      code: formData.code,
      name: formData.name,
      description: formData.description,
      icon: formData.icon,
      displayOrder: formData.displayOrder,
      status: formData.status,
      createdBy: userId,
      updatedBy: userId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      deletedBy: null,
    };

    await this.categoryRepo.createCategory(category);
    return category;
  }

  /** Update category, enforcing 'code' immutability and re-running validation checks */
  async updateCategory(id: string, formData: Partial<CategoryFormData>, userId: string): Promise<void> {
    const existing = await this.categoryRepo.getCategory(id);
    if (!existing) {
      throw new Error(`Category with ID ${id} not found`);
    }

    // Task 4: Enforce category code immutability
    if (formData.code !== undefined && formData.code !== existing.code) {
      throw new Error("Category field 'code' is immutable and cannot be updated after creation");
    }

    // Assemble merged representation to run validations
    const merged: CategoryFormData = {
      parentId: formData.parentId !== undefined ? formData.parentId : existing.parentId,
      code: existing.code,
      name: formData.name !== undefined ? formData.name : existing.name,
      description: formData.description !== undefined ? formData.description : existing.description,
      icon: formData.icon !== undefined ? formData.icon : existing.icon,
      displayOrder: formData.displayOrder !== undefined ? formData.displayOrder : existing.displayOrder,
      status: formData.status !== undefined ? formData.status : existing.status,
    };

    const valResult = validateCategory(merged);
    if (!valResult.isValid) {
      throw new Error(`Category validation failed: ${JSON.stringify(valResult.errors)}`);
    }

    // Write audited updates
    await this.categoryRepo.updateCategory(id, {
      parentId: merged.parentId,
      name: merged.name,
      description: merged.description,
      icon: merged.icon,
      displayOrder: merged.displayOrder,
      status: merged.status,
      updatedBy: userId,
      updatedAt: new Date().toISOString(),
    });
  }

  /** Soft delete a category */
  async deleteCategory(id: string, userId: string): Promise<void> {
    await this.categoryRepo.softDeleteCategory(id, userId);
  }

  /** Fetch active services (admin view includes draft/archived, patients see published only) */
  async getServices(
    filters?: {
      categoryId?: string;
      modality?: string;
      search?: string;
      fastingRequired?: boolean;
      contrastRequired?: boolean;
      featuredOnly?: boolean;
      popularOnly?: boolean;
    },
    options?: { isAdmin?: boolean; includeDeleted?: boolean }
  ): Promise<ImagingService[]> {
    let services = await this.serviceRepo.listServices(options?.includeDeleted);

    // Apply CatalogStatus visibility rules
    if (!options?.isAdmin) {
      services = services.filter((s) => s.status === CatalogStatus.Published);
    }

    // Apply query parameters
    if (filters) {
      if (filters.categoryId) {
        services = services.filter((s) => s.categoryId === filters.categoryId);
      }
      if (filters.modality) {
        services = services.filter((s) => s.modality.toUpperCase() === filters.modality?.toUpperCase());
      }
      if (filters.featuredOnly) {
        services = services.filter((s) => s.featured);
      }
      if (filters.popularOnly) {
        services = services.filter((s) => s.popular);
      }
      if (filters.fastingRequired !== undefined) {
        services = services.filter((s) => s.preparation.fastingRequired === filters.fastingRequired);
      }
      if (filters.contrastRequired !== undefined) {
        services = services.filter((s) => s.preparation.contrastRequired === filters.contrastRequired);
      }
      if (filters.search) {
        const queryStr = filters.search.toLowerCase().trim();
        services = services.filter(
          (s) =>
            s.serviceName.toLowerCase().includes(queryStr) ||
            s.serviceCode.toLowerCase().includes(queryStr) ||
            s.modality.toLowerCase().includes(queryStr) ||
            s.bodyPart.toLowerCase().includes(queryStr) ||
            s.aliases.some((a) => a.toLowerCase().includes(queryStr)) ||
            (s.keywords && s.keywords.some((k: string) => k.toLowerCase().includes(queryStr)))
        );
      }
    }

    return services;
  }

  /** Fetch single service by ID */
  async getService(id: string): Promise<ImagingService | null> {
    return this.serviceRepo.getService(id);
  }

  /** Fetch single service by slug */
  async getServiceBySlug(slug: string): Promise<ImagingService | null> {
    return this.serviceRepo.getServiceBySlug(slug);
  }

  /** Create a new service with full audit metadata */
  async createService(formData: ServiceFormData, userId: string): Promise<ImagingService> {
    const valResult = validateService(formData);
    if (!valResult.isValid) {
      throw new Error(`Service validation failed: ${JSON.stringify(valResult.errors)}`);
    }

    const id = doc(collection(this.db, "dummy")).id;
    const now = new Date().toISOString();

    const service: ImagingService = {
      id,
      categoryId: formData.categoryId,
      slug: formData.slug,
      serviceCode: formData.serviceCode,
      serviceName: formData.serviceName,
      aliases: formData.aliases,
      description: formData.description,
      modality: formData.modality,
      bodyPart: formData.bodyPart,
      durationMinutes: formData.durationMinutes,
      reportTatHours: formData.reportTatHours,
      thumbnail: formData.thumbnail,
      featured: formData.featured,
      popular: formData.popular,
      keywords: formData.keywords,
      preparation: formData.preparation,
      status: formData.status,
      createdBy: userId,
      updatedBy: userId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      deletedBy: null,
    };

    await this.serviceRepo.createService(service);
    return service;
  }

  /** Update service details, enforcing 'serviceCode' immutability and re-validating inputs */
  async updateService(id: string, formData: Partial<ServiceFormData>, userId: string): Promise<void> {
    const existing = await this.serviceRepo.getService(id);
    if (!existing) {
      throw new Error(`Service with ID ${id} not found`);
    }

    // Task 4: Enforce service code immutability
    if (formData.serviceCode !== undefined && formData.serviceCode !== existing.serviceCode) {
      throw new Error("Service field 'serviceCode' is immutable and cannot be updated after creation");
    }

    // Assemble merged representation to run validation
    const merged: ServiceFormData = {
      categoryId: formData.categoryId !== undefined ? formData.categoryId : existing.categoryId,
      slug: formData.slug !== undefined ? formData.slug : existing.slug,
      serviceCode: existing.serviceCode,
      serviceName: formData.serviceName !== undefined ? formData.serviceName : existing.serviceName,
      aliases: formData.aliases !== undefined ? formData.aliases : existing.aliases,
      description: formData.description !== undefined ? formData.description : existing.description,
      modality: formData.modality !== undefined ? formData.modality : existing.modality,
      bodyPart: formData.bodyPart !== undefined ? formData.bodyPart : existing.bodyPart,
      durationMinutes: formData.durationMinutes !== undefined ? formData.durationMinutes : existing.durationMinutes,
      reportTatHours: formData.reportTatHours !== undefined ? formData.reportTatHours : existing.reportTatHours,
      thumbnail: formData.thumbnail !== undefined ? formData.thumbnail : existing.thumbnail,
      featured: formData.featured !== undefined ? formData.featured : existing.featured,
      popular: formData.popular !== undefined ? formData.popular : existing.popular,
      preparation: formData.preparation !== undefined ? formData.preparation : existing.preparation,
      status: formData.status !== undefined ? formData.status : existing.status,
      keywords: formData.keywords !== undefined ? formData.keywords : existing.keywords,
    };

    const valResult = validateService(merged);
    if (!valResult.isValid) {
      throw new Error(`Service validation failed: ${JSON.stringify(valResult.errors)}`);
    }

    // Write audited updates
    await this.serviceRepo.updateService(id, {
      categoryId: merged.categoryId,
      slug: merged.slug,
      serviceName: merged.serviceName,
      aliases: merged.aliases,
      description: merged.description,
      modality: merged.modality,
      bodyPart: merged.bodyPart,
      durationMinutes: merged.durationMinutes,
      reportTatHours: merged.reportTatHours,
      thumbnail: merged.thumbnail,
      featured: merged.featured,
      popular: merged.popular,
      keywords: merged.keywords,
      preparation: merged.preparation,
      status: merged.status,
      updatedBy: userId,
      updatedAt: new Date().toISOString(),
    });
  }

  /** Soft delete a service */
  async deleteService(id: string, userId: string): Promise<void> {
    await this.serviceRepo.softDeleteService(id, userId);
  }
}
