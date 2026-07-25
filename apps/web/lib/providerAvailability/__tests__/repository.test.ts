// apps/web/lib/providerAvailability/__tests__/repository.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ImagingCenterAvailabilityRepository } from "../repositories/ImagingCenterAvailabilityRepository";
import { TechnicianAvailabilityRepository } from "../repositories/TechnicianAvailabilityRepository";

const mockGetDocs = vi.fn().mockResolvedValue({
  empty: false,
  docs: [
    {
      data: () => ({
        id: "avail-1",
        providerLocationId: "loc-1",
        workingDays: ["Monday"],
      }),
    },
  ],
  forEach: function (cb: (doc: { data: () => Record<string, unknown> }) => void) {
    this.docs.forEach(cb);
  },
});

const mockUpdateDoc = vi.fn().mockResolvedValue(undefined);

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn(() => ({})),
    doc: vi.fn(() => ({ id: "doc-1" })),
    query: vi.fn((col: unknown, ...constraints: unknown[]) => ({ col, constraints })),
    where: vi.fn((field: string, op: string, val: unknown) => ({ field, op, val })),
    orderBy: vi.fn((field: string, dir?: string) => ({ field, dir })),
    limit: vi.fn((n: number) => ({ limit: n })),
    startAfter: vi.fn((c: unknown) => ({ cursor: c })),
    getDocs: (...args: unknown[]) => mockGetDocs(...args),
    updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
    serverTimestamp: vi.fn(() => ({ seconds: 123456789 })),
  };
});

describe("ImagingCenterAvailabilityRepository", () => {
  let repo: ImagingCenterAvailabilityRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repo = new ImagingCenterAvailabilityRepository();
  });

  it("getByProviderLocationId queries Firestore by location ID", async () => {
    const res = await repo.getByProviderLocationId("loc-1");
    expect(mockGetDocs).toHaveBeenCalledTimes(1);
    expect(res?.id).toBe("avail-1");
  });

  it("softDelete updates deletedAt timestamp", async () => {
    await repo.softDelete("avail-1", "user-admin");
    expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
    const payload = mockUpdateDoc.mock.calls[0][1];
    expect(payload.deletedAt).toBeDefined();
    expect(payload.deletedBy).toBe("user-admin");
  });
});

describe("TechnicianAvailabilityRepository", () => {
  let repo: TechnicianAvailabilityRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repo = new TechnicianAvailabilityRepository();
  });

  it("getByDateAndPincode queries active technician schedules", async () => {
    const res = await repo.getByDateAndPincode("2026-07-28", "500001");
    expect(mockGetDocs).toHaveBeenCalledTimes(1);
    expect(res).toHaveLength(1);
  });
});
