// apps/web/lib/communication/__tests__/templateEngine.test.ts

import { describe, it, expect } from "vitest";
import { TemplateEngine } from "../utils/TemplateEngine";
import { NotificationTemplate } from "../models/types";
import { CommunicationChannel, NotificationCategory, TemplateStatus } from "../models/enums";
import { Timestamp } from "firebase/firestore";

describe("TemplateEngine", () => {
  const template: NotificationTemplate = {
    id: "tpl-1",
    code: "BookingConfirmed",
    name: "Booking Confirmed",
    channel: CommunicationChannel.SMS,
    category: NotificationCategory.BOOKING,
    subjectTemplate: "LabCircle Booking {{bookingId}} Confirmed",
    bodyTemplate: "Hello {{patientName}}, your appointment for {{serviceCategory}} is confirmed. Ref: {{bookingId}}.",
    version: 1,
    status: TemplateStatus.ACTIVE,
    createdAt: { seconds: 1000 } as unknown as Timestamp,
    updatedAt: { seconds: 1000 } as unknown as Timestamp,
  };

  it("substitutes dynamic variables inside subject and body templates", () => {
    const res = TemplateEngine.renderTemplate(template, {
      patientName: "John Doe",
      serviceCategory: "Blood Test",
      bookingId: "B-882211",
    });

    expect(res.renderedSubject).toBe("LabCircle Booking B-882211 Confirmed");
    expect(res.renderedBody).toBe("Hello John Doe, your appointment for Blood Test is confirmed. Ref: B-882211.");
  });
});
