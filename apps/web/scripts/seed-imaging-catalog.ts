// apps/web/scripts/seed-imaging-catalog.ts

import * as fs from "fs";
import * as path from "path";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

// 1. Simple zero-dependency environment loader to parse .env.local
function loadLocalEnv() {
  try {
    const envPath = path.resolve(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf-8");
      envContent.split("\n").forEach((line) => {
        const cleanLine = line.trim();
        if (!cleanLine || cleanLine.startsWith("#")) return;
        const index = cleanLine.indexOf("=");
        if (index > 0) {
          const key = cleanLine.substring(0, index).trim();
          const val = cleanLine
            .substring(index + 1)
            .trim()
            .replace(/^['"]|['"]$/g, "");
          if (key) {
            process.env[key] = val;
          }
        }
      });
      console.log("Loaded configuration variables from .env.local");
    }
  } catch (e) {
    console.warn("Skipped loading .env.local file:", e);
  }
}

loadLocalEnv();

// 2. Client Credentials initialization for Firebase
const clientCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "mock-api-key-for-builds",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mock-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mock-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mock-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456",
};

const app = initializeApp(clientCredentials);
const db = getFirestore(app);

// 3. Bind local emulator if flag is active
const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true";
if (useEmulator) {
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  console.log("Bound to Firestore Emulator on 127.0.0.1:8080");
} else {
  console.log(`Connecting to Live Firestore Project: ${clientCredentials.projectId}`);
}

const COLLECTIONS = {
  categories: "imaging_categories",
  services: "imaging_services",
};

// 4. Seeding datasets
const now = new Date().toISOString();
const parentId = "parent-diag-imaging";

const categoriesData = [
  {
    id: parentId,
    parentId: null,
    code: "DIAGNOSTIC-IMAGING",
    name: "Diagnostic Imaging",
    description: "Non-invasive scan and radiology imaging procedures.",
    icon: "Scan",
    displayOrder: 1,
    status: "Published",
  },
  { id: "cat-mri", parentId, name: "MRI", code: "MRI", icon: "Activity", displayOrder: 1, status: "Published", description: "MRI diagnostic catalog scans." },
  { id: "cat-ct", parentId, name: "CT Scan", code: "CT-SCAN", icon: "Disc", displayOrder: 2, status: "Published", description: "CT Scan diagnostic catalog scans." },
  { id: "cat-us", parentId, name: "Ultrasound", code: "ULTRASOUND", icon: "Waves", displayOrder: 3, status: "Published", description: "Ultrasound diagnostic catalog scans." },
  { id: "cat-xray", parentId, name: "X-Ray", code: "X-RAY", icon: "Grid", displayOrder: 4, status: "Published", description: "X-Ray diagnostic catalog scans." },
  { id: "cat-pet", parentId, name: "PET-CT", code: "PET-CT", icon: "Radio", displayOrder: 5, status: "Published", description: "PET-CT diagnostic catalog scans." },
  { id: "cat-mammo", parentId, name: "Mammography", code: "MAMMOGRAPHY", icon: "ShieldAlert", displayOrder: 6, status: "Published", description: "Mammography diagnostic catalog scans." },
  { id: "cat-dexa", parentId, name: "DEXA", code: "DEXA", icon: "Bone", displayOrder: 7, status: "Published", description: "DEXA diagnostic catalog scans." },
  { id: "cat-nucmed", parentId, name: "Nuclear Medicine", code: "NUCLEAR-MED", icon: "Atom", displayOrder: 8, status: "Published", description: "Nuclear Medicine diagnostic catalog scans." },
  { id: "cat-cardio", parentId, name: "Cardiology Diagnostics", code: "CARDIOLOGY", icon: "Heart", displayOrder: 9, status: "Published", description: "Cardiology Diagnostics catalog scans." },
  { id: "cat-pulm", parentId, name: "Pulmonary Diagnostics", code: "PULMONARY", icon: "Wind", displayOrder: 10, status: "Published", description: "Pulmonary Diagnostics catalog scans." },
  { id: "cat-neuro", parentId, name: "Neurology Diagnostics", code: "NEUROLOGY", icon: "Brain", displayOrder: 11, status: "Published", description: "Neurology Diagnostics catalog scans." },
  { id: "cat-dental", parentId, name: "Dental Imaging", code: "DENTAL", icon: "Smile", displayOrder: 12, status: "Published", description: "Dental Imaging catalog scans." },
  { id: "cat-women", parentId, name: "Women's Imaging", code: "WOMENS-IMAGING", icon: "Sparkles", displayOrder: 13, status: "Published", description: "Women's Imaging catalog scans." },
  { id: "cat-men", parentId, name: "Men's Imaging", code: "MENS-IMAGING", icon: "User", displayOrder: 14, status: "Published", description: "Men's Imaging catalog scans." },
  { id: "cat-ent", parentId, name: "ENT Diagnostics", code: "ENT-DIAG", icon: "Volume2", displayOrder: 15, status: "Published", description: "ENT Diagnostics catalog scans." },
  { id: "cat-ophth", parentId, name: "Ophthalmology Diagnostics", code: "OPHTHALMOLOGY", icon: "Eye", displayOrder: 16, status: "Published", description: "Ophthalmology Diagnostics catalog scans." },
];

const servicesData = [
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
    status: "Published",
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
    status: "Published",
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
    status: "Published",
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
    status: "Published",
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
    status: "Published",
  },
];

// 5. Execution seeder logic
async function runSeeder() {
  console.log("Initializing Diagnostic Imaging Catalog Seeder...");
  
  let categoriesInserted = 0;
  let categoriesSkipped = 0;
  let servicesInserted = 0;
  let servicesSkipped = 0;

  // Seeding categories
  for (const cat of categoriesData) {
    const docRef = doc(db, COLLECTIONS.categories, cat.id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      categoriesSkipped++;
    } else {
      await setDoc(docRef, {
        ...cat,
        createdBy: "system_seeder",
        updatedBy: "system_seeder",
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        deletedBy: null,
      });
      categoriesInserted++;
    }
  }

  // Seeding services
  for (const svc of servicesData) {
    const docRef = doc(db, COLLECTIONS.services, svc.id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      servicesSkipped++;
    } else {
      await setDoc(docRef, {
        ...svc,
        createdBy: "system_seeder",
        updatedBy: "system_seeder",
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        deletedBy: null,
      });
      servicesInserted++;
    }
  }

  console.log("\n==================================================");
  console.log("SEEDING RUN SUMMARY");
  console.log("==================================================");
  console.log(`Categories - Created: ${categoriesInserted}, Skipped (Already Exist): ${categoriesSkipped}`);
  console.log(`Services   - Created: ${servicesInserted}, Skipped (Already Exist): ${servicesSkipped}`);
  console.log("==================================================");
}

runSeeder()
  .then(() => {
    console.log("Seeding process completed successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seeding process encountered an error:", err);
    process.exit(1);
  });
