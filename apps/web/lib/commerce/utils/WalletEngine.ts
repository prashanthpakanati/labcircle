// apps/web/lib/commerce/utils/WalletEngine.ts

import { WalletTransactionType } from "../models/enums";
import { Wallet, WalletTransaction } from "../models/types";
import { Timestamp } from "firebase/firestore";

export class WalletEngine {
  /**
   * Applies double-entry ledger movement to a wallet entity.
   * Ensures an immutable WalletTransaction is generated first.
   */
  static applyLedgerTransaction(
    wallet: Wallet,
    type: WalletTransactionType,
    amount: number,
    referenceId: string,
    notes: string
  ): { updatedWallet: Wallet; ledgerEntry: Partial<WalletTransaction> } {
    if (amount <= 0) throw new Error("Wallet transaction amount must be greater than zero.");

    let newBalance = wallet.balance;

    if (type === WalletTransactionType.CREDIT || type === WalletTransactionType.REFUND_CREDIT || type === WalletTransactionType.PROMOTIONAL_CASHBACK || type === WalletTransactionType.REFERRAL_REWARD) {
      newBalance += amount;
    } else if (type === WalletTransactionType.DEBIT) {
      if (wallet.balance < amount) {
        throw new Error(`Insufficient wallet balance. Available: ₹${wallet.balance}, Requested: ₹${amount}`);
      }
      newBalance -= amount;
    }

    const now = { seconds: Math.floor(Date.now() / 1000) } as Timestamp;

    const ledgerEntry: Partial<WalletTransaction> = {
      walletId: wallet.patientId,
      type,
      amount,
      balanceAfter: newBalance,
      referenceId,
      notes,
      createdAt: now,
    };

    const updatedWallet: Wallet = {
      ...wallet,
      balance: newBalance,
      updatedAt: now,
    };

    return { updatedWallet, ledgerEntry };
  }
}
