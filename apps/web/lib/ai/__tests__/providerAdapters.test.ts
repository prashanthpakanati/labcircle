// apps/web/lib/ai/__tests__/providerAdapters.test.ts

import { describe, it, expect } from "vitest";
import { MockAIAdapter } from "../adapters/AIProviderAdapter";

describe("MockAIAdapter", () => {
  it("executes mock AI response generation and returns token usage + cost", async () => {
    const adapter = new MockAIAdapter();
    const res = await adapter.generate("Explain HbA1c test results");

    expect(res.responseText).toContain("[AI Copilot Response]");
    expect(res.promptTokens).toBeGreaterThan(0);
    expect(res.costINR).toBe(0.15);
  });
});
