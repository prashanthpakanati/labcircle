// apps/web/lib/commerce/__tests__/service.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest";
import { PaymentStatus, PaymentMethodType } from "../models/enums";
import { Timestamp } from "firebase/firestore";

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn(() => ({})),
    doc: vi.fn(() => ({ id: "gen-comm-id" })),
    serverTimestamp: vi.fn(() => Timestamp.now()),
  };
});

const mockPaymentRepo = {
  create: vi.fn().mockResolvedValue(undefined),
  getById: vi.fn().mockResolvedValue(null),
  getByBookingId: vi.fn().mockResolvedValue([]),
  update: vi.fn().mockResolvedValue(undefined),
};

const mockWalletRepo = {
  getWallet: vi.fn().mockResolvedValue(null),
  saveWallet: vi.fn().mockResolvedValue(undefined),
  addLedgerTransaction: vi.fn().mockResolvedValue(undefined),
  getLedgerHistory: vi.fn().mockResolvedValue([]),
};

const mockInvoiceRepo = {
  create: vi.fn().mockResolvedValue(undefined),
  getById: vi.fn().mockResolvedValue(null),
  getByBookingId: vi.fn().mockResolvedValue(null),
};

const mockAuditRepo = {
  logAction: vi.fn().mockResolvedValue(undefined),
  search: vi.fn().mockResolvedValue({ auditLogs: [], nextCursor: undefined }),
};

vi.mock("../repositories/PaymentRepository", () => ({
  PaymentRepository: vi.fn(function () {
    return mockPaymentRepo;
  }),
}));

vi.mock("../repositories/WalletRepository", () => ({
  WalletRepository: vi.fn(function () {
    return mockWalletRepo;
  }),
}));

vi.mock("../repositories/InvoiceRepository", () => ({
  InvoiceRepository: vi.fn(function () {
    return mockInvoiceRepo;
  }),
}));

vi.mock("../repositories/CommerceAuditRepository", () => ({
  CommerceAuditRepository: vi.fn(function () {
    return mockAuditRepo;
  }),
}));

const { CommerceService } = await import("../services/CommerceService");

describe("CommerceService", () => {
  let service: InstanceType<typeof CommerceService>;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new CommerceService();
  });

  it("processes payment and generates GST invoice + audit record", async () => {
    const res = await service.processPayment(
      {
        bookingId: "b-999",
        patientId: "pat-1",
        amount: 765,
        paymentMethod: PaymentMethodType.UPI,
        gateway: "MOCK",
      },
      "pat-1",
      "Patient"
    );

    expect(res.payment.status).toBe(PaymentStatus.CAPTURED);
    expect(res.invoice).toBeDefined();
    expect(res.invoice?.invoiceNumber).toMatch(/^INV-/);
    expect(mockPaymentRepo.create).toHaveBeenCalledTimes(1);
    expect(mockInvoiceRepo.create).toHaveBeenCalledTimes(1);
    expect(mockAuditRepo.logAction).toHaveBeenCalledTimes(1);
  });

  it("tops up patient wallet creating double-entry ledger record", async () => {
    const updatedWallet = await service.topupWallet(
      { patientId: "pat-1", amount: 500, notes: "App Referral Cashback" },
      "admin-1",
      "Admin"
    );

    expect(updatedWallet.balance).toBe(500);
    expect(mockWalletRepo.addLedgerTransaction).toHaveBeenCalledTimes(1);
    expect(mockWalletRepo.saveWallet).toHaveBeenCalledTimes(1);
    expect(mockAuditRepo.logAction).toHaveBeenCalledTimes(1);
  });

  it("denies mutation actions for unauthorized roles (Viewer)", async () => {
    await expect(
      service.processPayment(
        {
          bookingId: "b-999",
          patientId: "pat-1",
          amount: 765,
          paymentMethod: PaymentMethodType.UPI,
        },
        "viewer-1",
        "Viewer"
      )
    ).rejects.toThrow("Permission Denied");
  });
});
