// apps/web/lib/integration/__tests__/sdkGeneratorEngine.test.ts

import { describe, it, expect } from "vitest";
import { SDKGeneratorEngine } from "../utils/SDKGeneratorEngine";
import { SDKLanguage } from "../models/enums";

describe("SDKGeneratorEngine", () => {
  it("generates SDK release package download URL for TypeScript", () => {
    const release = SDKGeneratorEngine.generateSDKPackage(SDKLanguage.TYPESCRIPT, "1.4.0");

    expect(release.language).toBe(SDKLanguage.TYPESCRIPT);
    expect(release.version).toBe("1.4.0");
    expect(release.downloadUrl).toContain("typescript-v1.4.0.zip");
  });
});
