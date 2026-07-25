// apps/web/lib/commerce/repositories/WalletRepository.ts

import { getFirestore, collection, doc, setDoc, getDoc, query, where, orderBy, getDocs, serverTimestamp } from "firebase/firestore";
import { Wallet, WalletTransaction } from "../models/types";

export class WalletRepository {
  private readonly walletCol = collection(getFirestore(), "wallets");
  private readonly ledgerCol = collection(getFirestore(), "wallet_transactions");

  async getWallet(patientId: string): Promise<Wallet | null> {
    const snap = await getDoc(doc(this.walletCol, patientId));
    if (!snap.exists()) return null;
    return snap.data() as Wallet;
  }

  async saveWallet(wallet: Wallet): Promise<void> {
    const ref = doc(this.walletCol, wallet.patientId);
    await setDoc(ref, {
      ...wallet,
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * Writes an immutable double-entry ledger entry.
   */
  async addLedgerTransaction(txn: WalletTransaction): Promise<void> {
    const ref = doc(this.ledgerCol, txn.id);
    await setDoc(ref, {
      ...txn,
      createdAt: serverTimestamp(),
    });
  }

  async getLedgerHistory(walletId: string): Promise<WalletTransaction[]> {
    const q = query(this.ledgerCol, where("walletId", "==", walletId), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const txns: WalletTransaction[] = [];
    snap.forEach((d) => txns.push(d.data() as WalletTransaction));
    return txns;
  }
}
