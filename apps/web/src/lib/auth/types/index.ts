import { User } from "firebase/auth";
import { Timestamp, FieldValue } from "firebase/firestore";
import { Role } from "../roles";
import { Permission } from "../permissions";

export interface AuthenticatedUser {
  uid: string;
  email: string | null;
  phoneNumber: string | null;
  displayName: string | null;
  role: Role;
  associationId: string | null;
  permissions: Permission[];
  firebaseUser: User;
}

export interface UserDocument {
  uid: string;
  role: Role;
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  status: "active" | "suspended" | "pending";
  createdAt: Timestamp | FieldValue;
  lastLoginAt: Timestamp | FieldValue;
  schemaVersion: number;
}
