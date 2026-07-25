// apps/web/lib/providerOfferings/__tests__/repository.test.ts

/**
 * Unit tests for ProviderOfferingRepository helper methods & soft-delete restore.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProviderOfferingRepository } from "../repositories/ProviderOfferingRepository";

// ── Firestore Mocks ──────────────────────────────────────────────────────────

const mockSearch = vi.fn().mockResolvedValue({ offerings: [{ id: "offering-1" }], nextCursor: undefined });
const mockUpdateDoc = vi.fn().mockResolvedValue(undefined);

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn(() => ({})),
    doc: vi.fn(() => ({ id: "offering-1" })),
    updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
    serverTimestamp: vi.fn(() => ({ seconds: 123456789 })),
  };
});

describe("ProviderOfferingRepository Helper Methods", () => {
  let repo: ProviderOfferingRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repo = new ProviderOfferingRepository();
    // Spy on search method to ensure helper functions delegate properly
    vi.spyOn(repo, "search").mockImplementation(mockSearch);
  });

  it("getByLocation delegates to search with providerLocationId filter", async () => {
    const results = await repo.getByLocation("loc-100", 50);

    expect(repo.search).toHaveBeenCalledWith({ providerLocationId: "loc-100" }, 50);
    expect(results).toEqual([{ id: "offering-1" }]);
  });

  it("getByDiagnosticService delegates to search with diagnosticServiceId filter", async () => {
    const results = await repo.getByDiagnosticService("svc-200", 25);

    expect(repo.search).toHaveBeenCalledWith({ diagnosticServiceId: "svc-200" }, 25);
    expect(results).toEqual([{ id: "offering-1" }]);
  });

  it("restore clears deletion metadata and updates timestamp", async () => {
    await repo.restore("offering-1");

    expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
    const payload = mockUpdateDoc.mock.calls[0][1];
    expect(payload.deletedAt).toBeNull();
    expect(payload.deletedBy).toBeNull();
    expect(payload.updatedAt).toBeDefined();
  });
});
