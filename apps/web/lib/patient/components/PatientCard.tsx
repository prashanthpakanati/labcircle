import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PatientStatusBadge from "./PatientStatusBadge";
import { Patient } from "../models/types";

interface PatientCardProps {
  patient: Patient;
}

export default function PatientCard({ patient }: PatientCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{patient.firstName} {patient.lastName}</CardTitle>
        <Badge variant="secondary">{patient.displayId}</Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <PatientStatusBadge status={patient.status} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <button className="text-sm text-primary hover:underline">View</button>
      </CardFooter>
    </Card>
  );
}
