// apps/web/lib/providerOfferings/__tests__/validation.test.ts

import { describe, it, expect } from "vitest";
import {
  validateProviderOffering,
  isValidStatusTransition,
} from "../validation/validateProviderOffering";
import { ProviderOfferingStatus } from "../models/enums";
import type { ProviderOfferingFormData } from "../models/form";

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeValid(): ProviderOfferingFormData {
  return {
    priceConfiguration: { mrp: 1000, sellingPrice: 800 },
    availability: { enabled: true, onlineBookable: false },
    displayOrder: 0,
    status: ProviderOfferingStatus.Draft,
  };
}

// ── Pricing validation ────────────────────────────────────────────────────────

describe("validateProviderOffering – pricing", () => {
  it("accepts a valid pricing configuration", () => {
    const result = validateProviderOffering(makeValid());
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("rejects a negative MRP", () => {
    const data = makeValid();
    data.priceConfiguration.mrp = -1;
    const result = validateProviderOffering(data);
    expect(result.isValid).toBe(false);
    expect(result.errors["priceConfiguration.mrp"]).toBeDefined();
  });

  it("rejects sellingPrice greater than MRP", () => {
    const data = makeValid();
    data.priceConfiguration.sellingPrice = 2000;
    const result = validateProviderOffering(data);
    expect(result.isValid).toBe(false);
    expect(result.errors["priceConfiguration.sellingPrice"]).toMatch(/exceed MRP/);
  });

  it("rejects memberPrice >= sellingPrice", () => {
    const data = makeValid();
    data.priceConfiguration.memberPrice = 800; // equal to selling price
    const result = validateProviderOffering(data);
    expect(result.isValid).toBe(false);
    expect(result.errors["priceConfiguration.memberPrice"]).toMatch(/less than/);
  });

  it("rejects offerPrice greater than sellingPrice", () => {
    const data = makeValid();
    data.priceConfiguration.offerPrice = 900; // > sellingPrice 800
    const result = validateProviderOffering(data);
    expect(result.isValid).toBe(false);
    expect(result.errors["priceConfiguration.offerPrice"]).toMatch(/cannot exceed/);
  });

  it("accepts valid optional prices", () => {
    const data = makeValid();
    data.priceConfiguration.memberPrice = 700;
    data.priceConfiguration.offerPrice = 750;
    const result = validateProviderOffering(data);
    expect(result.isValid).toBe(true);
  });

  it("accepts sellingPrice equal to MRP", () => {
    const data = makeValid();
    data.priceConfiguration.sellingPrice = 1000;
    const result = validateProviderOffering(data);
    expect(result.isValid).toBe(true);
  });

  it("accepts zero sellingPrice", () => {
    const data = makeValid();
    data.priceConfiguration.sellingPrice = 0;
    data.priceConfiguration.mrp = 0;
    const result = validateProviderOffering(data);
    expect(result.isValid).toBe(true);
  });
});

// ── Availability validation ───────────────────────────────────────────────────

describe("validateProviderOffering – availability", () => {
  it("rejects onlineBookable=true when enabled=false", () => {
    const data = makeValid();
    data.availability = { enabled: false, onlineBookable: true };
    const result = validateProviderOffering(data);
    expect(result.isValid).toBe(false);
    expect(result.errors["availability.onlineBookable"]).toMatch(/cannot be enabled/);
  });

  it("accepts enabled=false with onlineBookable=false", () => {
    const data = makeValid();
    data.availability = { enabled: false, onlineBookable: false };
    const result = validateProviderOffering(data);
    expect(result.isValid).toBe(true);
  });
});

// ── Display order ─────────────────────────────────────────────────────────────

describe("validateProviderOffering – displayOrder", () => {
  it("rejects negative displayOrder", () => {
    const data = makeValid();
    data.displayOrder = -1;
    const result = validateProviderOffering(data);
    expect(result.isValid).toBe(false);
    expect(result.errors.displayOrder).toBeDefined();
  });

  it("accepts displayOrder = 0", () => {
    const data = makeValid();
    data.displayOrder = 0;
    const result = validateProviderOffering(data);
    expect(result.isValid).toBe(true);
  });
});

// ── Status lifecycle ──────────────────────────────────────────────────────────

describe("isValidStatusTransition", () => {
  it("allows Draft → Published", () => {
    expect(
      isValidStatusTransition(ProviderOfferingStatus.Draft, ProviderOfferingStatus.Published)
    ).toBe(true);
  });

  it("allows Published → Archived", () => {
    expect(
      isValidStatusTransition(ProviderOfferingStatus.Published, ProviderOfferingStatus.Archived)
    ).toBe(true);
  });

  it("allows Archived → Draft (restore)", () => {
    expect(
      isValidStatusTransition(ProviderOfferingStatus.Archived, ProviderOfferingStatus.Draft)
    ).toBe(true);
  });

  it("rejects Draft → Archived (skip)", () => {
    expect(
      isValidStatusTransition(ProviderOfferingStatus.Draft, ProviderOfferingStatus.Archived)
    ).toBe(false);
  });

  it("rejects Archived → Published (skip restore step)", () => {
    expect(
      isValidStatusTransition(ProviderOfferingStatus.Archived, ProviderOfferingStatus.Published)
    ).toBe(false);
  });

  it("rejects Published → Draft (backwards)", () => {
    expect(
      isValidStatusTransition(ProviderOfferingStatus.Published, ProviderOfferingStatus.Draft)
    ).toBe(false);
  });
});
