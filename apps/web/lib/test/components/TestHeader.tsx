// apps/web/lib/test/components/TestHeader.tsx

"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TestHeader() {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Test Catalog</h1>
        <p className="text-sm text-muted-foreground">Manage and configure diagnostic tests, pricing, and turnaround times.</p>
      </div>
      <Link href="/tests/new" passHref legacyBehavior>
        <Button variant="primary" size="sm" className="gap-1.5 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Create New Test
        </Button>
      </Link>
    </header>
  );
}
