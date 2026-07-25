// apps/web/lib/commerce/utils/PaymentOrchestrator.ts

import { PaymentStatus, PaymentMethodType } from "../models/enums";
import { PaymentTransaction } from "../models/types";
import { Timestamp } from "firebase/firestore";

export interface PaymentGatewayAdapter {
  gatewayName: "RAZORPAY" | "PHONEPE" | "STRIPE" | "MOCK";
  authorizeAndCapture(amount: number, currency: string): Promise<{ success: boolean; gatewayTxnId: string; error?: string }>;
}

export class MockGatewayAdapter implements PaymentGatewayAdapter {
  gatewayName = "MOCK" as const;
  async authorizeAndCapture(amount: number, currency: string) {
    if (amount <= 0 || !currency) throw new Error("Invalid payment parameters");
    return {
      success: true,
      gatewayTxnId: `MOCK_TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    };
  }
}

export class RazorpayAdapter implements PaymentGatewayAdapter {
  gatewayName = "RAZORPAY" as const;
  async authorizeAndCapture(amount: number, currency: string) {
    if (amount <= 0 || !currency) throw new Error("Invalid payment parameters");
    return {
      success: true,
      gatewayTxnId: `rzp_live_${Date.now()}`,
    };
  }
}

/**
 * PaymentOrchestrator
 * -------------------
 * Gateway-independent orchestrator executing payment requests via adapter implementations.
 */
export class PaymentOrchestrator {
  private static adapters: Record<string, PaymentGatewayAdapter> = {
    MOCK: new MockGatewayAdapter(),
    RAZORPAY: new RazorpayAdapter(),
    PHONEPE: new MockGatewayAdapter(),
    STRIPE: new MockGatewayAdapter(),
  };

  static async processPayment(
    bookingId: string,
    patientId: string,
    amount: number,
    paymentMethod: PaymentMethodType,
    gateway: "RAZORPAY" | "PHONEPE" | "STRIPE" | "MOCK" = "MOCK"
  ): Promise<Partial<PaymentTransaction>> {
    const adapter = this.adapters[gateway] ?? this.adapters.MOCK;
    const res = await adapter.authorizeAndCapture(amount, "INR");

    const now = { seconds: Math.floor(Date.now() / 1000) } as Timestamp;

    if (!res.success) {
      return {
        bookingId,
        patientId,
        gateway,
        gatewayTxnId: "FAILED",
        amount,
        currency: "INR",
        paymentMethod,
        status: PaymentStatus.FAILED,
        createdAt: now,
        updatedAt: now,
      };
    }

    return {
      bookingId,
      patientId,
      gateway,
      gatewayTxnId: res.gatewayTxnId,
      amount,
      currency: "INR",
      paymentMethod,
      status: PaymentStatus.CAPTURED,
      createdAt: now,
      updatedAt: now,
    };
  }
}
