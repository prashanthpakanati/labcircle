// apps/web/lib/ai/adapters/AIProviderAdapter.ts

import { AIProvider } from "../models/enums";

export interface AIProviderAdapter {
  providerName: AIProvider;
  defaultModel: string;
  generate(prompt: string, context?: string): Promise<{ responseText: string; promptTokens: number; completionTokens: number; costINR: number }>;
  healthCheck(): Promise<boolean>;
}

export class MockAIAdapter implements AIProviderAdapter {
  providerName = AIProvider.MOCK;
  defaultModel = "mock-gpt-4o";

  async generate(prompt: string, context?: string) {
    if (!prompt) throw new Error("Prompt text is required.");

    let reply = `[AI Copilot Response]: Based on your query '${prompt.slice(0, 30)}...'`;
    if (context) {
      reply += ` using retrieved clinical context.`;
    }

    return {
      responseText: reply,
      promptTokens: 120,
      completionTokens: 80,
      costINR: 0.15, // Approx ₹0.15 cost per mock completion
    };
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }
}
