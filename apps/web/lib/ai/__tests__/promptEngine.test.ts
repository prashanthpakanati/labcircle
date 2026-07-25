// apps/web/lib/ai/__tests__/promptEngine.test.ts

import { describe, it, expect } from "vitest";
import { PromptEngine } from "../utils/PromptEngine";
import { PromptTemplate } from "../models/types";
import { PromptStatus } from "../models/enums";
import { Timestamp } from "firebase/firestore";

describe("PromptEngine Template Rendering", () => {
  const template: PromptTemplate = {
    id: "prompt-1",
    code: "PATIENT_REPORT_EXPLANATION",
    name: "Patient Report Explanation",
    category: "CLINICAL",
    templateBody: "Hello {{patientName}}, your {{testName}} result is {{testValue}} {{unit}}.",
    status: PromptStatus.ACTIVE,
    version: 1,
    createdAt: { seconds: 1000 } as unknown as Timestamp,
    updatedAt: { seconds: 1000 } as unknown as Timestamp,
  };

  it("renders versioned prompt template with variable substitution", () => {
    const rendered = PromptEngine.renderPrompt(template, {
      patientName: "Jane Doe",
      testName: "Fasting Blood Glucose",
      testValue: "92",
      unit: "mg/dL",
    });

    expect(rendered).toBe("Hello Jane Doe, your Fasting Blood Glucose result is 92 mg/dL.");
  });
});
