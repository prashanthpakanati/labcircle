"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface PatientSearchProps {
  onSearch: (query: string) => void;
}

export default function PatientSearch({ onSearch }: PatientSearchProps) {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setValue(q);
    onSearch(q);
  };

  return (
    <div className="flex items-center space-x-2">
      <Search className="h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search patients…"
        value={value}
        onChange={handleChange}
        className="flex-1"
      />
    </div>
  );
}
