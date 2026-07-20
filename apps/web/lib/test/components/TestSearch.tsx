// apps/web/lib/test/components/TestSearch.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TestSearchProps {
  onSearch: (query: string) => void;
  defaultValue?: string;
}

export default function TestSearch({ onSearch, defaultValue = "" }: TestSearchProps) {
  const [value, setValue] = useState(defaultValue);
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchRef.current(value);
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search by name, code, or display ID..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-9 w-full"
        aria-label="Search tests"
      />
    </div>
  );
}
