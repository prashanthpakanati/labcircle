// apps/web/lib/sample/components/PatientInformationCard.tsx

"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Patient } from "../../patient/models/types";
import { User, Phone, Calendar, Hash } from "lucide-react";

interface PatientInformationCardProps {
  patient: Patient | null;
  patientId?: string;
}

function calculateAge(dob?: string): string {
  if (!dob) return "N/A";
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return "N/A";
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? `${age} yrs` : "N/A";
}

export default function PatientInformationCard({
  patient,
  patientId,
}: PatientInformationCardProps) {
  if (!patient) {
    return (
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-base font-semibold">Patient Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground font-mono">
            Patient ID: {patientId || "Unknown"}
          </p>
        </CardContent>
      </Card>
    );
  }

  const ageDisplay = calculateAge(patient.dateOfBirth);

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-base font-semibold">Patient Information</CardTitle>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {patient.displayId}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 text-xs">
        <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">
              {patient.firstName} {patient.lastName}
            </h4>
            <p className="text-[11px] text-muted-foreground">
              {patient.gender} • {ageDisplay}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-slate-700">
          <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded border border-slate-100">
            <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">{patient.phone}</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded border border-slate-100">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">DOB: {patient.dateOfBirth}</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded border border-slate-100 col-span-2">
            <Hash className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="truncate font-mono">ID: {patient.id}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
