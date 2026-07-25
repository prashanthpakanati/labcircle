// apps/web/lib/ai/utils/RecommendationEngine.ts

import { AIRecommendation } from "../models/types";
import { RecommendationStatus } from "../models/enums";
import { Timestamp } from "firebase/firestore";

export class RecommendationEngine {
  /**
   * Generates explainable AI recommendations requiring human approval.
   * Never applies recommendations automatically.
   */
  static createRecommendation(
    type: string,
    targetEntityId: string,
    confidencePercent: number,
    reasoning: string,
    evidence: string[]
  ): Partial<AIRecommendation> {
    const now = { seconds: Math.floor(Date.now() / 1000) } as Timestamp;

    return {
      type,
      targetEntityId,
      confidencePercent,
      reasoning,
      evidence,
      status: RecommendationStatus.PENDING,
      createdAt: now,
    };
  }
}
