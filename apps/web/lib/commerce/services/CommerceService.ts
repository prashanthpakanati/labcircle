// apps/web/lib/commerce/services/CommerceService.ts

import { getFirestore, collection, doc, serverTimestamp, Timestamp } from "firebase/firestore";
import { PaymentRepository } from "../repositories/PaymentRepository";
import { WalletRepository } from "../repositories/WalletRepository";
import { InvoiceRepository } from "../repositories/InvoiceRepository";
import { CommerceAuditRepository } from "../repositories/CommerceAuditRepository";
import { PaymentTransaction, Wallet, WalletTransaction, Invoice, PricingBreakdown, CommerceAuditRecord } from "../models/types";
import { PaymentStatus, WalletType, WalletTransactionType } from "../models/enums";
import { ProcessPaymentFormData, WalletTopupFormData } from "../models/form";
import { PricingEngine } from "../utils/PricingEngine";
import { PaymentOrchestrator } from "../utils/PaymentOrchestrator";
import { WalletEngine } from "../utils/WalletEngine";
import { InvoiceEngine } from "../utils/InvoiceEngine";
import { validatePaymentProcess, validateWalletTopup } from "../validation/validateCommerce";

export type CommerceRole = "SuperAdmin" | "Admin" | "FinanceManager" | "Patient" | "Viewer";

const MUTATION_ROLES: CommerceRole[] = ["SuperAdmin", "Admin", "FinanceManager", "Patient"];

export class CommerceService {
  private paymentRepo = new PaymentRepository();
  private walletRepo = new WalletRepository();
  private invoiceRepo = new InvoiceRepository();
  private auditRepo = new CommerceAuditRepository();
  private db = getFirestore();

  private assertRole(role: CommerceRole, allowed: CommerceRole[], action: string): void {
    if (!allowed.includes(role)) {
      throw new Error(`Permission Denied: Commerce role '${role}' is not authorized to ${action}.`);
    }
  }

  private async audit(action: string, actorId: string, actorRole: CommerceRole, targetEntity: string, targetEntityId: string, changes: Record<string, unknown>): Promise<void> {
    const id = doc(collection(this.db, "pricing_audit")).id;
    const now = serverTimestamp() as unknown as Timestamp;
    const record: CommerceAuditRecord = {
      id,
      action,
      actorId,
      actorRole,
      targetEntity,
      targetEntityId,
      changes,
      timestamp: now,
    };
    await this.auditRepo.logAction(record);
  }

  // ── Public API ──────────────────────────────────────────────────────────

  calculatePricing(
    serviceCategory: string,
    isHomeCollection: boolean,
    isExpress: boolean,
    membershipDiscountPercent = 0,
    couponDiscountValue = 0
  ): PricingBreakdown {
    return PricingEngine.calculatePricing(
      serviceCategory,
      isHomeCollection,
      isExpress,
      membershipDiscountPercent,
      couponDiscountValue
    );
  }

  /**
   * Orchestrates payment capture via PaymentOrchestrator and issues GST Tax Invoice.
   */
  async processPayment(
    formData: ProcessPaymentFormData,
    actorId: string,
    actorRole: CommerceRole
  ): Promise<{ payment: PaymentTransaction; invoice?: Invoice }> {
    this.assertRole(actorRole, MUTATION_ROLES, "process payment");

    const val = validatePaymentProcess(formData);
    if (!val.isValid) throw new Error(`Validation failed: ${JSON.stringify(val.errors)}`);

    const rawTxn = await PaymentOrchestrator.processPayment(
      formData.bookingId,
      formData.patientId,
      formData.amount,
      formData.paymentMethod,
      formData.gateway ?? "MOCK"
    );

    const id = doc(collection(this.db, "payment_transactions")).id;
    const now = serverTimestamp() as unknown as Timestamp;

    const payment: PaymentTransaction = {
      id,
      bookingId: formData.bookingId,
      patientId: formData.patientId,
      gateway: formData.gateway ?? "MOCK",
      gatewayTxnId: rawTxn.gatewayTxnId ?? "MOCK",
      amount: formData.amount,
      currency: "INR",
      paymentMethod: formData.paymentMethod,
      status: rawTxn.status ?? PaymentStatus.CAPTURED,
      createdAt: now,
      updatedAt: now,
    };

    await this.paymentRepo.create(payment);
    await this.audit("PROCESS_PAYMENT", actorId, actorRole, "payment_transactions", id, formData as unknown as Record<string, unknown>);

    let invoice: Invoice | undefined;
    if (payment.status === PaymentStatus.CAPTURED) {
      const pricing = PricingEngine.calculatePricing("LAB_TEST", true, false);
      const rawInvoice = InvoiceEngine.generateInvoice(formData.bookingId, formData.patientId, "Customer", pricing);
      const invoiceId = doc(collection(this.db, "invoices")).id;

      invoice = {
        ...rawInvoice,
        id: invoiceId,
      } as Invoice;

      await this.invoiceRepo.create(invoice);
    }

    return { payment, invoice };
  }

  /**
   * Top-up patient wallet enforcing immutable double-entry ledger entry.
   */
  async topupWallet(formData: WalletTopupFormData, actorId: string, actorRole: CommerceRole): Promise<Wallet> {
    this.assertRole(actorRole, MUTATION_ROLES, "topup wallet");

    const val = validateWalletTopup(formData);
    if (!val.isValid) throw new Error(`Validation failed: ${JSON.stringify(val.errors)}`);

    let existing = await this.walletRepo.getWallet(formData.patientId);
    const now = serverTimestamp() as unknown as Timestamp;

    if (!existing) {
      existing = {
        patientId: formData.patientId,
        type: WalletType.PATIENT,
        balance: 0,
        promotionalBalance: 0,
        currency: "INR",
        updatedAt: now,
      };
    }

    const { updatedWallet, ledgerEntry } = WalletEngine.applyLedgerTransaction(
      existing,
      WalletTransactionType.CREDIT,
      formData.amount,
      `TOPUP_${Date.now()}`,
      formData.notes
    );

    const ledgerId = doc(collection(this.db, "wallet_transactions")).id;
    const txn: WalletTransaction = {
      ...ledgerEntry,
      id: ledgerId,
    } as WalletTransaction;

    await this.walletRepo.addLedgerTransaction(txn);
    await this.walletRepo.saveWallet(updatedWallet);
    await this.audit("TOPUP_WALLET", actorId, actorRole, "wallets", formData.patientId, { amount: formData.amount });

    return updatedWallet;
  }

  async getWallet(patientId: string): Promise<Wallet | null> {
    return this.walletRepo.getWallet(patientId);
  }

  async getWalletLedger(patientId: string): Promise<WalletTransaction[]> {
    return this.walletRepo.getLedgerHistory(patientId);
  }
}
