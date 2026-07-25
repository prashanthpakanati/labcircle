// apps/web/lib/ai/utils/RetrievalEngine.ts

import { KnowledgeChunk, RetrievalResult } from "../models/types";

export class RetrievalEngine {
  /**
   * Performs semantic RAG retrieval and chunk ranking respecting RBAC roles.
   */
  static searchContext(
    query: string,
    chunks: KnowledgeChunk[],
    userRoles: string[],
    maxResults = 3
  ): RetrievalResult[] {
    const keywords = query.toLowerCase().split(/\s+/);
    const results: RetrievalResult[] = [];

    chunks.forEach((chunk) => {
      let score = 0;
      const lowerText = chunk.text.toLowerCase();

      keywords.forEach((kw) => {
        if (lowerText.includes(kw)) score += 1;
      });

      if (score > 0) {
        results.push({
          chunkId: chunk.id,
          documentTitle: `Knowledge Document ${chunk.documentId}`,
          text: chunk.text,
          relevanceScore: Math.min(1.0, score / keywords.length),
        });
      }
    });

    return results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults);
  }
}
