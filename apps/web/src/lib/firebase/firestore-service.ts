import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  Timestamp,
  GeoPoint,
} from "firebase/firestore";
import { db } from "./client";

// --- TYPES & INTERFACES ---

export interface UserProfile {
  email: string;
  phone: string;
  role: "patient" | "phlebotomist" | "lab_technician" | "pathologist" | "admin";
  displayName?: string | null;
  schemaVersion: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface PatientProfile {
  id?: string;
  primaryUserUid: string;
  fullName: string;
  dob: Timestamp;
  biologicalSex: "male" | "female" | "other";
  abhaId?: string | null;
  abhaAddress?: string | null;
  profilePhotoUrl?: string | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface FamilyMember {
  id?: string;
  primaryPatientId: string;
  fullName: string;
  relation: "spouse" | "child" | "parent" | "sibling";
  dob: Timestamp;
  biologicalSex: "male" | "female" | "other";
  abhaId?: string | null;
  createdAt?: Timestamp;
}

export interface AddressRecord {
  id?: string;
  userUid: string;
  label: "Home" | "Work" | "Other";
  addressLine1: string;
  addressLine2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  pincode: string;
  coordinates: GeoPoint;
  createdAt?: Timestamp;
}

// --- USER PROFILE SERVICES ---

/**
 * Fetch a user account profile by UID.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return docSnap.data() as UserProfile;
}

/**
 * Set/Create a user profile.
 */
export async function createUserProfile(uid: string, data: Omit<UserProfile, "createdAt" | "updatedAt">): Promise<void> {
  const docRef = doc(db, "users", uid);
  await setDoc(docRef, {
    ...data,
    schemaVersion: 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// --- PATIENT PROFILE SERVICES ---

/**
 * Fetch a patient profile by document ID.
 */
export async function getPatientProfile(id: string): Promise<PatientProfile | null> {
  const docRef = doc(db, "patients", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as PatientProfile;
}

/**
 * Query patient profiles managed by a primary user UID.
 */
export async function getPatientProfilesByUser(uid: string): Promise<PatientProfile[]> {
  const q = query(
    collection(db, "patients"),
    where("primaryUserUid", "==", uid),
    where("isDeleted", "!=", true)
  );
  const querySnapshot = await getDocs(q);
  const results: PatientProfile[] = [];
  querySnapshot.forEach((document) => {
    results.push({ id: document.id, ...document.data() } as PatientProfile);
  });
  return results;
}

/**
 * Create a new patient profile.
 */
export async function createPatientProfile(data: Omit<PatientProfile, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const collRef = collection(db, "patients");
  const docRef = await addDoc(collRef, {
    ...data,
    isDeleted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// --- FAMILY MEMBERS SERVICES ---

/**
 * Fetch all family members linked to a primary patient ID.
 */
export async function getFamilyMembers(primaryPatientId: string): Promise<FamilyMember[]> {
  const q = query(
    collection(db, "family_members"),
    where("primaryPatientId", "==", primaryPatientId),
    where("isDeleted", "!=", true)
  );
  const querySnapshot = await getDocs(q);
  const results: FamilyMember[] = [];
  querySnapshot.forEach((document) => {
    results.push({ id: document.id, ...document.data() } as FamilyMember);
  });
  return results;
}

/**
 * Link a new family member dependent.
 */
export async function addFamilyMember(data: Omit<FamilyMember, "id" | "createdAt">): Promise<string> {
  const collRef = collection(db, "family_members");
  const docRef = await addDoc(collRef, {
    ...data,
    isDeleted: false,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// --- ADDRESS SERVICES ---

/**
 * Fetch all saved addresses for a user UID.
 */
export async function getSavedAddresses(uid: string): Promise<AddressRecord[]> {
  const q = query(
    collection(db, "addresses"),
    where("userUid", "==", uid),
    where("isDeleted", "!=", true)
  );
  const querySnapshot = await getDocs(q);
  const results: AddressRecord[] = [];
  querySnapshot.forEach((document) => {
    results.push({ id: document.id, ...document.data() } as AddressRecord);
  });
  return results;
}

/**
 * Save a new geolocation address.
 */
export async function addAddress(data: Omit<AddressRecord, "id" | "createdAt">): Promise<string> {
  const collRef = collection(db, "addresses");
  const docRef = await addDoc(collRef, {
    ...data,
    isDeleted: false,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
