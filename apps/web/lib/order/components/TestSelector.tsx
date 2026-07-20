// apps/web/lib/order/components/TestSelector.tsx

"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTests } from "../../test/hooks/useTests";
import { Test } from "../../test/models/types";
import { TestStatus } from "../../test/models/enums";
import { FlaskConical, Search, Plus, Check } from "lucide-react";

interface TestSelectorProps {
  selectedTestIds: string[];
  onAddTest: (test: Test) => void;
  error?: string;
}

export default function TestSelector({
  selectedTestIds,
  onAddTest,
  error,
}: TestSelectorProps) {
  const { data: tests, loading, error: fetchError } = useTests();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTests = useMemo(() => {
    if (!tests) return [];
    const activeTests = tests.filter((t) => t.status === TestStatus.Active);
    if (!searchQuery.trim()) return activeTests.slice(0, 5);
    const q = searchQuery.toLowerCase().trim();
    return activeTests
      .filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q) ||
          t.displayId.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [tests, searchQuery]);

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <FlaskConical className="h-5 w-5 text-indigo-500" />
        <CardTitle className="text-base font-semibold">2. Add Tests</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search test by name, code, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            aria-label="Search tests to add"
          />
        </div>

        {loading ? (
          <p className="text-xs text-muted-foreground py-2">Loading test catalog...</p>
        ) : fetchError ? (
          <p className="text-xs text-destructive py-2">Failed to load test catalog.</p>
        ) : filteredTests.length === 0 ? (
          <p className="text-xs text-muted-foreground py-2">No matching active tests found.</p>
        ) : (
          <div className="divide-y border border-border rounded-md overflow-hidden bg-white">
            {filteredTests.map((t) => {
              const isSelected = selectedTestIds.includes(t.id);
              return (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-slate-900">{t.name}</span>
                      <span className="bg-slate-100 text-slate-800 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                        {t.code}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {t.department} • ₹{t.labCirclePrice.toLocaleString()} (LabCircle)
                    </span>
                  </div>
                  <Button
                    variant={isSelected ? "outline" : "primary"}
                    size="sm"
                    onClick={() => !isSelected && onAddTest(t)}
                    disabled={isSelected}
                    className="h-7 text-xs gap-1"
                  >
                    {isSelected ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        Added
                      </>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5" />
                        Add
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {error && <p className="text-xs text-destructive font-medium">{error}</p>}
      </CardContent>
    </Card>
  );
}
