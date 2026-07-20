// apps/web/lib/order/components/PatientSelector.tsx

"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePatients } from "../../patient/hooks/usePatients";
import { Patient } from "../../patient/models/types";
import { User, Search, UserCheck, RefreshCw } from "lucide-react";

interface PatientSelectorProps {
  selectedPatient: Patient | null;
  onSelectPatient: (patient: Patient | null) => void;
  error?: string;
}

export default function PatientSelector({
  selectedPatient,
  onSelectPatient,
  error,
}: PatientSelectorProps) {
  const { data: patients, loading, error: fetchError } = usePatients();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = useMemo(() => {
    if (!patients) return [];
    if (!searchQuery.trim()) return patients.slice(0, 5);
    const q = searchQuery.toLowerCase().trim();
    return patients
      .filter(
        (p) =>
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
          p.phone.includes(q) ||
          p.displayId.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [patients, searchQuery]);

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-base font-semibold">1. Select Patient</CardTitle>
        </div>
        {selectedPatient && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectPatient(null)}
            className="h-8 text-xs gap-1"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Change Patient
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-2 space-y-4">
        {selectedPatient ? (
          <div className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-full text-blue-600">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">
                  {selectedPatient.firstName} {selectedPatient.lastName}
                </h4>
                <p className="text-xs text-muted-foreground font-mono">
                  ID: {selectedPatient.displayId} • Phone: {selectedPatient.phone}
                </p>
                <p className="text-xs text-muted-foreground">
                  Gender: {selectedPatient.gender} • DOB: {selectedPatient.dateOfBirth}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patient by name, phone, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                aria-label="Search patient"
              />
            </div>

            {loading ? (
              <p className="text-xs text-muted-foreground py-2">Loading patients...</p>
            ) : fetchError ? (
              <p className="text-xs text-destructive py-2">Failed to load patients.</p>
            ) : filteredPatients.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">No matching patients found.</p>
            ) : (
              <div className="divide-y border border-border rounded-md overflow-hidden bg-white">
                {filteredPatients.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectPatient(p)}
                    className="flex items-center justify-between p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="font-medium text-sm text-slate-900 block">
                        {p.firstName} {p.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {p.displayId} • {p.phone}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Select
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {error && <p className="text-xs text-destructive font-medium">{error}</p>}
      </CardContent>
    </Card>
  );
}
