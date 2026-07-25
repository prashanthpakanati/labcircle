// apps/web/lib/ai/__tests__/retrievalEngine.test.ts

import { describe, it, expect } from "vitest";
import { RetrievalEngine } from "../utils/RetrievalEngine";
import { KnowledgeChunk } from "../models/types";

describe("RetrievalEngine RAG Semantic Search", () => {
  const chunks: KnowledgeChunk[] = [
    {
      id: "chunk-1",
      documentId: "doc-100",
      chunkIndex: 0,
      text: "Fasting blood sugar between 70 and 99 mg/dL is considered normal.",
    },
    {
      id: "chunk-2",
      documentId: "doc-101",
      chunkIndex: 0,
      text: "Thyroid stimulating hormone TSH evaluates thyroid function.",
    },
  ];

  it("ranks knowledge chunks by keyword relevance", () => {
    const results = RetrievalEngine.searchContext("fasting blood sugar normal", chunks, ["Patient"]);

    expect(results.length).toBe(1);
    expect(results[0].chunkId).toBe("chunk-1");
    expect(results[0].relevanceScore).toBeGreaterThan(0);
  });
});
