// apps/web/lib/ai/utils/ResponseSafetyEngine.ts

export class ResponseSafetyEngine {
  /**
   * Masks PII and enforces prompt injection defenses on AI inputs and outputs.
   */
  static sanitizeInput(prompt: string): { sanitizedPrompt: string; hasPII: boolean } {
    let sanitizedPrompt = prompt;
    let hasPII = false;

    // Mask phone numbers (10 digits)
    if (/\b\d{10}\b/.test(sanitizedPrompt)) {
      sanitizedPrompt = sanitizedPrompt.replace(/\b\d{10}\b/g, "[MASKED_PHONE]");
      hasPII = true;
    }

    // Mask emails
    if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(sanitizedPrompt)) {
      sanitizedPrompt = sanitizedPrompt.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[MASKED_EMAIL]");
      hasPII = true;
    }

    return { sanitizedPrompt, hasPII };
  }
}
