// apps/web/lib/commerce/__tests__/walletEngine.test.ts

import { describe, it, expect } from "vitest";
import { WalletEngine } from "../utils/WalletEngine";
import { WalletType, WalletTransactionType } from "../models/enums";
import { Timestamp } from "firebase/firestore";
import { Wallet } from "../models/types";

describe("WalletEngine Double-Entry Ledger", () => {
  const initialWallet: Wallet = {
    patientId: "pat-100",
    type: WalletType.PATIENT,
    balance: 500,
    promotionalBalance: 0,
    currency: "INR",
    updatedAt: { seconds: 1000 } as unknown as Timestamp,
  };

  it("applies credit ledger transaction and updates balance", () => {
    const { updatedWallet, ledgerEntry } = WalletEngine.applyLedgerTransaction(
      initialWallet,
      WalletTransactionType.CREDIT,
      200,
      "TOPUP-001",
      "Wallet Topup"
    );

    expect(updatedWallet.balance).toBe(700);
    expect(ledgerEntry.balanceAfter).toBe(700);
    expect(ledgerEntry.type).toBe(WalletTransactionType.CREDIT);
  });

  it("applies debit transaction and reduces balance", () => {
    const { updatedWallet, ledgerEntry } = WalletEngine.applyLedgerTransaction(
      initialWallet,
      WalletTransactionType.DEBIT,
      300,
      "PAY-001",
      "Booking Payment"
    );

    expect(updatedWallet.balance).toBe(200);
    expect(ledgerEntry.balanceAfter).toBe(200);
  });

  it("throws error when debit exceeds available wallet balance", () => {
    expect(() =>
      WalletEngine.applyLedgerTransaction(
        initialWallet,
        WalletTransactionType.DEBIT,
        1000,
        "PAY-OVER",
        "Overdraft"
      )
    ).toThrow("Insufficient wallet balance");
  });
});
