// apps/web/lib/ai/utils/PromptEngine.ts

import { PromptTemplate } from "../models/types";

export class PromptEngine {
  /**
   * Substitutes prompt variables inside versioned prompt templates.
   */
  static renderPrompt(template: PromptTemplate, variables: Record<string, string>): string {
    let body = template.templateBody;

    Object.entries(variables).forEach(([k, v]) => {
      const regex = new RegExp(`{{\\s*${k}\\s*}}`, "g");
      body = body.replace(regex, v);
    });

    return body;
  }
}
