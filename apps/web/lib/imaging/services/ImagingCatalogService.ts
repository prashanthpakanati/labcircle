// apps/web/lib/imaging/services/ImagingCatalogService.ts

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { COLLECTIONS } from "../models/constants";
import { ImagingCategory, ImagingService } from "../models/types";
import { ImagingMapper } from "../models/form";

export class ImagingCatalogService {
  private db = getFirestore();

  /**
   * Fetches all imaging categories.
   * Automatically runs database seed if categories collection is empty.
   */
  async getCategories(): Promise<ImagingCategory[]> {
    const colRef = collection(this.db, COLLECTIONS.categories);
    const snap = await getDocs(colRef);
    
    if (snap.empty) {
      await this.seedDiagnosticCatalog();
      const reSnap = await getDocs(colRef);
      return reSnap.docs.map((d) => 
        ImagingMapper.fromCategoryFirestore({ id: d.id, ...d.data() })
      ).sort((a, b) => a.displayOrder - b.displayOrder);
    }

    return snap.docs.map((d) => 
      ImagingMapper.fromCategoryFirestore({ id: d.id, ...d.data() })
    ).sort((a, b) => a.displayOrder - b.displayOrder);
  }

  /**
   * Fetch a single category by ID.
   */
  async getCategory(id: string): Promise<ImagingCategory | null> {
    const docRef = doc(this.db, COLLECTIONS.categories, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return ImagingMapper.fromCategoryFirestore({ id: snap.id, ...snap.data() });
  }

  /**
   * Creates a new category.
   */
  async createCategory(data: Omit<ImagingCategory, "id" | "createdAt" | "updatedAt"> & { id?: string }): Promise<ImagingCategory> {
    const id = data.id || doc(collection(this.db, COLLECTIONS.categories)).id;
    const now = new Date().toISOString();
    const category: ImagingCategory = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    const docRef = doc(this.db, COLLECTIONS.categories, id);
    await setDoc(docRef, ImagingMapper.toCategoryFirestore(category));
    return category;
  }

  /**
   * Updates an existing category.
   */
  async updateCategory(id: string, data: Partial<Omit<ImagingCategory, "id" | "createdAt" | "updatedAt">>): Promise<void> {
    const docRef = doc(this.db, COLLECTIONS.categories, id);
    const updatePayload: Record<string, unknown> = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await updateDoc(docRef, updatePayload);
  }

  /**
   * Fetches services matching optional filters.
   * If services collection is empty, triggers a auto-seed.
   */
  async getServices(filters?: {
    categoryId?: string;
    modality?: string;
    search?: string;
    activeOnly?: boolean;
    featuredOnly?: boolean;
    popularOnly?: boolean;
    fastingRequired?: boolean;
    contrastRequired?: boolean;
  }): Promise<ImagingService[]> {
    const colRef = collection(this.db, COLLECTIONS.services);
    let snap = await getDocs(colRef);

    if (snap.empty) {
      await this.seedDiagnosticCatalog();
      snap = await getDocs(colRef);
    }

    let services = snap.docs.map((d) =>
      ImagingMapper.fromServiceFirestore({ id: d.id, ...d.data() })
    );

    // Apply client-side filters (simplifies querying without requiring Firestore index setup)
    if (filters) {
      if (filters.activeOnly) {
        services = services.filter((s) => s.active);
      }
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

  /**
   * Fetch a single service by ID.
   */
  async getService(id: string): Promise<ImagingService | null> {
    const docRef = doc(this.db, COLLECTIONS.services, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return ImagingMapper.fromServiceFirestore({ id: snap.id, ...snap.data() });
  }

  /**
   * Fetch a single service by URL slug.
   */
  async getServiceBySlug(slug: string): Promise<ImagingService | null> {
    const colRef = collection(this.db, COLLECTIONS.services);
    const q = query(colRef, where("slug", "==", slug));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const docSnap = snap.docs[0];
    return ImagingMapper.fromServiceFirestore({ id: docSnap.id, ...docSnap.data() });
  }

  /**
   * Create a new imaging service catalog item.
   */
  async createService(data: Omit<ImagingService, "id" | "createdAt" | "updatedAt"> & { id?: string }): Promise<ImagingService> {
    const id = data.id || doc(collection(this.db, COLLECTIONS.services)).id;
    const now = new Date().toISOString();
    const service: ImagingService = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    const docRef = doc(this.db, COLLECTIONS.services, id);
    await setDoc(docRef, ImagingMapper.toServiceFirestore(service));
    return service;
  }

  /**
   * Update an imaging service catalog item details.
   */
  async updateService(id: string, data: Partial<Omit<ImagingService, "id" | "createdAt" | "updatedAt">>): Promise<void> {
    const docRef = doc(this.db, COLLECTIONS.services, id);
    const updatePayload: Record<string, unknown> = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await updateDoc(docRef, updatePayload);
  }

  /**
   * Internal Seeder to populate dynamic hierarchical categories & predefined imaging services.
   * Executed automatically on initial list access if Firestore contains 0 records.
   */
  private async seedDiagnosticCatalog(): Promise<void> {
    // 1. Create Parent Category (Diagnostic Imaging)
    const parentId = "parent-diag-imaging";
    const now = new Date().toISOString();
    
    await setDoc(doc(this.db, COLLECTIONS.categories, parentId), {
      id: parentId,
      parentId: null,
      code: "DIAGNOSTIC-IMAGING",
      name: "Diagnostic Imaging",
      description: "Non-invasive scan and radiology imaging procedures.",
      icon: "Scan",
      displayOrder: 1,
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    // 2. Define Category Child Entries
    const childCategories = [
      { id: "cat-mri", name: "MRI", code: "MRI", icon: "Activity", displayOrder: 1 },
      { id: "cat-ct", name: "CT Scan", code: "CT-SCAN", icon: "Disc", displayOrder: 2 },
      { id: "cat-us", name: "Ultrasound", code: "ULTRASOUND", icon: "Waves", displayOrder: 3 },
      { id: "cat-xray", name: "X-Ray", code: "X-RAY", icon: "Grid", displayOrder: 4 },
      { id: "cat-pet", name: "PET-CT", code: "PET-CT", icon: "Radio", displayOrder: 5 },
      { id: "cat-mammo", name: "Mammography", code: "MAMMOGRAPHY", icon: "ShieldAlert", displayOrder: 6 },
      { id: "cat-dexa", name: "DEXA", code: "DEXA", icon: "Bone", displayOrder: 7 },
      { id: "cat-nucmed", name: "Nuclear Medicine", code: "NUCLEAR-MED", icon: "Atom", displayOrder: 8 },
      { id: "cat-cardio", name: "Cardiology Diagnostics", code: "CARDIOLOGY", icon: "Heart", displayOrder: 9 },
      { id: "cat-pulm", name: "Pulmonary Diagnostics", code: "PULMONARY", icon: "Wind", displayOrder: 10 },
      { id: "cat-neuro", name: "Neurology Diagnostics", code: "NEUROLOGY", icon: "Brain", displayOrder: 11 },
      { id: "cat-dental", name: "Dental Imaging", code: "DENTAL", icon: "Smile", displayOrder: 12 },
      { id: "cat-women", name: "Women's Imaging", code: "WOMENS-IMAGING", icon: "Sparkles", displayOrder: 13 },
      { id: "cat-men", name: "Men's Imaging", code: "MENS-IMAGING", icon: "User", displayOrder: 14 },
      { id: "cat-ent", name: "ENT Diagnostics", code: "ENT-DIAG", icon: "Volume2", displayOrder: 15 },
      { id: "cat-ophth", name: "Ophthalmology Diagnostics", code: "OPHTHALMOLOGY", icon: "Eye", displayOrder: 16 },
    ];

    for (const cat of childCategories) {
      await setDoc(doc(this.db, COLLECTIONS.categories, cat.id), {
        id: cat.id,
        parentId,
        code: cat.code,
        name: cat.name,
        description: `${cat.name} diagnostic catalog scans.`,
        icon: cat.icon,
        displayOrder: cat.displayOrder,
        active: true,
        createdAt: now,
        updatedAt: now,
      });
    }

    // 3. Predefined Services Seeding List
    const initialServices = [
      {
        id: "svc-mri-brain",
        categoryId: "cat-mri",
        slug: "mri-brain",
        serviceCode: "MRI-BRAIN",
        serviceName: "MRI Brain",
        aliases: ["Magnetic Resonance Imaging Brain", "Brain Scan", "Head MRI"],
        description: "High-resolution diagnostic scanning of the brain structure using magnetic resonance fields. Essential for stroke, tumors, and neurological diagnostic investigations.",
        modality: "MRI",
        bodyPart: "Brain",
        durationMinutes: 45,
        reportTatHours: 24,
        thumbnail: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=400",
        featured: true,
        popular: true,
        keywords: ["brain", "head", "neuro", "magnetic", "mri"],
        preparation: {
          fastingRequired: false,
          waterAllowed: true,
          contrastRequired: false,
          removeMetalObjects: true,
          pregnancyWarning: true,
          medicationInstructions: "Take your regular prescription medications unless advised otherwise by your doctor.",
          documentRequirements: ["Doctor prescription is mandatory.", "Carry previous scan/MRI films if available."],
          additionalInstructions: "Please arrive 15 minutes before the slot for safety screening. Do not wear clothing containing metallic fibers or zippers.",
        },
        active: true,
      },
      {
        id: "svc-ct-chest",
        categoryId: "cat-ct",
        slug: "hrct-chest",
        serviceCode: "CT-CHEST-HRCT",
        serviceName: "HRCT Chest",
        aliases: ["High-Resolution CT Chest", "Lung CT Scan", "Thorax CT"],
        description: "Detailed diagnostic evaluation of lung tissue to diagnose pneumonia, COVID-19 sequelae, pulmonary fibrosis, and respiratory pathologies.",
        modality: "CT Scan",
        bodyPart: "Chest",
        durationMinutes: 20,
        reportTatHours: 12,
        thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=400",
        featured: true,
        popular: true,
        keywords: ["chest", "lung", "thorax", "ct", "hrct"],
        preparation: {
          fastingRequired: true,
          fastingHours: 4,
          waterAllowed: true,
          contrastRequired: false,
          removeMetalObjects: true,
          pregnancyWarning: true,
          medicationInstructions: "Regular cardiac and diabetes medications can be continued.",
          documentRequirements: ["Prescription from a pulmonologist or doctor.", "Previous chest X-Rays/CTs."],
          additionalInstructions: "Inform technician if you are diabetic, take metformin, or have kidney issues.",
        },
        active: true,
      },
      {
        id: "svc-xray-chest",
        categoryId: "cat-xray",
        slug: "chest-x-ray",
        serviceCode: "XRAY-CHEST-PA",
        serviceName: "Chest X-Ray PA View",
        aliases: ["Chest X-Ray PA", "CXR PA View"],
        description: "Standard primary diagnostic radiograph of the chest cavity. Quick diagnostic screening for lung infections, heart size, and rib fractures.",
        modality: "X-Ray",
        bodyPart: "Chest",
        durationMinutes: 10,
        reportTatHours: 6,
        thumbnail: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&q=80&w=400",
        featured: false,
        popular: true,
        keywords: ["chest", "xray", "cxr", "lung", "pa"],
        preparation: {
          fastingRequired: false,
          waterAllowed: true,
          contrastRequired: false,
          removeMetalObjects: true,
          pregnancyWarning: true,
          documentRequirements: ["Doctor prescription."],
          additionalInstructions: "You will be asked to wear a surgical gown. Remove neck chains and metallic torso items.",
        },
        active: true,
      },
      {
        id: "svc-us-abdomen",
        categoryId: "cat-us",
        slug: "whole-abdomen-ultrasound",
        serviceCode: "US-WHOLE-ABDOMEN",
        serviceName: "Whole Abdomen Ultrasound",
        aliases: ["USG Whole Abdomen", "Abdomen Sonography"],
        description: "Non-invasive abdominal imaging scanning liver, gallbladder, kidneys, spleen, pancreas, urinary bladder, and pelvic organs.",
        modality: "Ultrasound",
        bodyPart: "Abdomen",
        durationMinutes: 30,
        reportTatHours: 12,
        thumbnail: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400",
        featured: true,
        popular: true,
        keywords: ["abdomen", "usg", "ultrasound", "liver", "kidney"],
        preparation: {
          fastingRequired: true,
          fastingHours: 6,
          waterAllowed: true,
          contrastRequired: false,
          removeMetalObjects: false,
          pregnancyWarning: false,
          additionalInstructions: "Drink 4-5 glasses of water 1 hour before the scan. Do not void urine; a full bladder is essential for clear pelvic diagnostics.",
        },
        active: true,
      },
      {
        id: "svc-pet-ct",
        categoryId: "cat-pet",
        slug: "whole-body-pet-ct",
        serviceCode: "PETCT-WHOLE-BODY",
        serviceName: "Whole Body PET-CT",
        aliases: ["PET CT Scan", "Cancer Staging Scan"],
        description: "Advanced molecular imaging combining PET metabolic detection and CT structural scanning. Primarily used in oncology staging and response checks.",
        modality: "PET-CT",
        bodyPart: "Whole Body",
        durationMinutes: 120,
        reportTatHours: 48,
        thumbnail: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=400",
        featured: true,
        popular: false,
        keywords: ["pet", "petct", "cancer", "staging", "whole body"],
        preparation: {
          fastingRequired: true,
          fastingHours: 12,
          waterAllowed: true,
          contrastRequired: true,
          removeMetalObjects: true,
          pregnancyWarning: true,
          medicationInstructions: "Diabetes medications must be strictly coordinated. Blood glucose must be under 150 mg/dL prior to scan injection.",
          documentRequirements: ["Doctor prescription.", "Previous clinical oncology history.", "Creatinine blood test report."],
          additionalInstructions: "Strictly avoid exercise and sugars 24 hours prior. Rest quietly in a dark room after radiotracer injection.",
        },
        active: true,
      },
    ];

    for (const svc of initialServices) {
      await setDoc(doc(this.db, COLLECTIONS.services, svc.id), {
        id: svc.id,
        categoryId: svc.categoryId,
        slug: svc.slug,
        serviceCode: svc.serviceCode,
        serviceName: svc.serviceName,
        aliases: svc.aliases,
        description: svc.description,
        modality: svc.modality,
        bodyPart: svc.bodyPart,
        durationMinutes: svc.durationMinutes,
        reportTatHours: svc.reportTatHours,
        thumbnail: svc.thumbnail,
        featured: svc.featured,
        popular: svc.popular,
        keywords: svc.keywords,
        preparation: svc.preparation,
        active: svc.active,
        createdAt: now,
        updatedAt: now,
      });
    }
  }
}
