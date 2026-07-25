// apps/web/lib/commerce/utils/InvoiceEngine.ts

import { Invoice, PricingBreakdown } from "../models/types";
import { InvoiceStatus } from "../models/enums";
import { Timestamp } from "firebase/firestore";

export class InvoiceEngine {
  /**
   * Generates a structured GST Tax Invoice document from pricing breakdown details.
   */
  static generateInvoice(
    bookingId: string,
    patientId: string,
    patientName: string,
    pricing: PricingBreakdown
  ): Partial<Invoice> {
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
    const now = { seconds: Math.floor(Date.now() / 1000) } as Timestamp;

    return {
      invoiceNumber,
      bookingId,
      patientId,
      patientName,
      items: [
        {
          description: "Diagnostic Healthcare Services",
          hsnSacCode: "999312",
          quantity: 1,
          unitPrice: pricing.basePrice,
          amount: pricing.basePrice,
          taxableAmount: pricing.taxableAmount,
          gstAmount: pricing.cgst + pricing.sgst + pricing.igst,
        },
      ],
      subtotal: pricing.basePrice + pricing.homeCollectionFee + pricing.expressFee,
      discountTotal: pricing.membershipDiscount + pricing.couponDiscount,
      taxableTotal: pricing.taxableAmount,
      cgstAmount: pricing.cgst,
      sgstAmount: pricing.sgst,
      igstAmount: pricing.igst,
      totalAmount: pricing.totalPayable,
      status: InvoiceStatus.ISSUED,
      issuedAt: now,
    };
  }
}
