// apps/web/lib/communication/utils/TemplateEngine.ts

import { NotificationTemplate } from "../models/types";

export class TemplateEngine {
  /**
   * Performs dynamic variable substitution (e.g. {{patientName}}, {{bookingId}}) inside template body.
   */
  static renderTemplate(
    template: NotificationTemplate,
    variables: Record<string, string>
  ): { renderedSubject?: string; renderedBody: string } {
    let renderedBody = template.bodyTemplate;
    let renderedSubject = template.subjectTemplate;

    Object.entries(variables).forEach(([key, val]) => {
      const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      renderedBody = renderedBody.replace(placeholder, val);
      if (renderedSubject) {
        renderedSubject = renderedSubject.replace(placeholder, val);
      }
    });

    return { renderedSubject, renderedBody };
  }
}
