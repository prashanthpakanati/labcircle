// apps/web/lib/order/components/PatientInfoCard.tsx

"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { usePatient } from "../../patient/hooks/usePatient";
import { calculateAge } from "../../patient/validation/calculateAge";
import { User } from "lucide-react";

interface PatientInfoCardProps {
  patientId: string;
}

export default function PatientInfoCard({ patientId }: PatientInfoCardProps) {
  const { data: patient, loading, error } = usePatient(patientId);

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <User className="h-5 w-5 text-blue-500" />
        <CardTitle className="text-base font-semibold">Patient Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {loading ? (
          <div className="space-y-2 animate-pulse py-2">
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-3 bg-slate-200 rounded w-1/3"></div>
          </div>
        ) : error || !patient ? (
          <p className="text-xs text-muted-foreground py-2 font-mono">
            Patient ID: {patientId} (Details unavailable)
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs text-muted-foreground block">Full Name</span>
              <span className="font-semibold text-xs text-slate-900">
                {patient.firstName} {patient.lastName}
              </span>
            </div>

            <div>
              <span className="text-xs text-muted-foreground block">Patient Display ID</span>
              <span className="font-mono text-xs font-bold text-slate-800">{patient.displayId}</span>
            </div>

            <div>
              <span className="text-xs text-muted-foreground block">Age / Gender</span>
              <span className="text-xs text-slate-800">
                {calculateAge(patient.dateOfBirth)} yrs • {patient.gender}
              </span>
            </div>

            <div>
              <span className="text-xs text-muted-foreground block">Phone Number</span>
              <span className="font-mono text-xs text-slate-800">{patient.phone}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
