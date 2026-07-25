// apps/web/lib/commerce/__tests__/paymentOrchestrator.test.ts

import { describe, it, expect } from "vitest";
import { PaymentOrchestrator } from "../utils/PaymentOrchestrator";
import { PaymentStatus, PaymentMethodType } from "../models/enums";

describe("PaymentOrchestrator Adapter Pattern", () => {
  it("processes payment via MockGatewayAdapter", async () => {
    const res = await PaymentOrchestrator.processPayment(
      "b-100",
      "p-100",
      765,
      PaymentMethodType.UPI,
      "MOCK"
    );

    expect(res.status).toBe(PaymentStatus.CAPTURED);
    expect(res.gatewayTxnId).toMatch(/^MOCK_TXN_/);
    expect(res.amount).toBe(765);
  });

  it("processes payment via RazorpayAdapter", async () => {
    const res = await PaymentOrchestrator.processPayment(
      "b-100",
      "p-100",
      1200,
      PaymentMethodType.CARD,
      "RAZORPAY"
    );

    expect(res.status).toBe(PaymentStatus.CAPTURED);
    expect(res.gatewayTxnId).toMatch(/^rzp_live_/);
  });
});
