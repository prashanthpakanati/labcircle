// apps/web/lib/test/models/form.ts

import { Test } from "./types";
import { TestDepartment, TestCategory } from "./enums";

export interface TestFormData {
  name: string;
  code: string;
  department: TestDepartment;
  category: TestCategory;
  specimenType: string;
  method: string;
  tatHours: number;
  urgentTatHours: number;
  mrp: number;
  b2bPrice: number;
  labCirclePrice: number;
  homeCollection: boolean;
}

/**
 * Mapping utilities between Firestore Test model and TestFormData.
 */
export const TestMapper = {
  /** Convert Firestore Test to TestFormData */
  toTestForm(test: Test): TestFormData {
    const {
      name,
      code,
      department,
      category,
      specimenType,
      method,
      tatHours,
      urgentTatHours,
      mrp,
      b2bPrice,
      labCirclePrice,
      homeCollection,
    } = test;
    return {
      name,
      code,
      department,
      category,
      specimenType,
      method,
      tatHours,
      urgentTatHours,
      mrp,
      b2bPrice,
      labCirclePrice,
      homeCollection,
    };
  },

  /** Convert TestFormData (plus optional overrides) to Firestore Test */
  toTest(form: TestFormData, overrides?: Partial<Test>): Test {
    return {
      ...overrides,
      ...form,
    } as Test;
  },

  /** Serialize Test for Firestore */
  toFirestore(test: Test): Record<string, unknown> {
    const {
      id,
      displayId,
      name,
      code,
      department,
      category,
      specimenType,
      method,
      tatHours,
      urgentTatHours,
      mrp,
      b2bPrice,
      labCirclePrice,
      homeCollection,
      status,
      createdAt,
      updatedAt,
    } = test;
    return {
      id,
      displayId,
      name,
      code,
      department,
      category,
      specimenType,
      method,
      tatHours,
      urgentTatHours,
      mrp,
      b2bPrice,
      labCirclePrice,
      homeCollection,
      status,
      createdAt,
      updatedAt,
    };
  },

  /** Construct Test from Firestore data */
  fromFirestore(data: Record<string, unknown>): Test {
    return data as unknown as Test;
  },
};
