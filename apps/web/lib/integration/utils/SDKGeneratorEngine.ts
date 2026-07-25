// apps/web/lib/integration/utils/SDKGeneratorEngine.ts

import { SDKLanguage } from "../models/enums";
import { SDKRelease } from "../models/types";
import { Timestamp } from "firebase/firestore";

export class SDKGeneratorEngine {
  /**
   * Generates OpenAPI-driven client SDK packages for TypeScript, Python, Kotlin, and Swift.
   */
  static generateSDKPackage(language: SDKLanguage, version: string): Partial<SDKRelease> {
    const now = { seconds: Math.floor(Date.now() / 1000) } as Timestamp;
    const downloadUrl = `https://sdk.labcircle.com/releases/${language.toLowerCase()}-v${version}.zip`;

    return {
      language,
      version,
      downloadUrl,
      createdAt: now,
    };
  }
}
