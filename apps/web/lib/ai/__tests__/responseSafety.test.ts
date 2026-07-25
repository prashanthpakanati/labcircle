// apps/web/lib/ai/__tests__/responseSafety.test.ts

import { describe, it, expect } from "vitest";
import { ResponseSafetyEngine } from "../utils/ResponseSafetyEngine";

describe("ResponseSafetyEngine PII Masking", () => {
  it("masks phone numbers and email addresses in input prompts", () => {
    const raw = "Contact me at 9876543210 or user@example.com for my report.";
    const { sanitizedPrompt, hasPII } = ResponseSafetyEngine.sanitizeInput(raw);

    expect(hasPII).toBe(true);
    expect(sanitizedPrompt).toContain("[MASKED_PHONE]");
    expect(sanitizedPrompt).toContain("[MASKED_EMAIL]");
    expect(sanitizedPrompt).not.toContain("9876543210");
  });
});
