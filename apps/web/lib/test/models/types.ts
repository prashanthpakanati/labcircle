// apps/web/lib/test/models/types.ts

import { TestStatus, TestDepartment, TestCategory } from "./enums";

export interface Test {
  id: string;
  displayId: string; // e.g. TST000001
  name: string;
  code: string; // unique test code, e.g., "CBC"
  department: TestDepartment;
  category: TestCategory;
  specimenType: string; // e.g., "Blood", "Urine"
  method: string; // e.g., "ELISA", "HPLC"
  tatHours: number;
  urgentTatHours: number;
  mrp: number;
  b2bPrice: number;
  labCirclePrice: number;
  homeCollection: boolean;
  status: TestStatus;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
