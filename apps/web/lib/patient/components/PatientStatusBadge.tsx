import React from "react";
import { Badge } from "@/components/ui/badge";
import { PatientStatus } from "../models/enums";

export default function PatientStatusBadge({ status }: { status: PatientStatus }) {
  const variantMap: Record<PatientStatus, Parameters<typeof Badge>[0]["variant"]> = {
    [PatientStatus.Active]: "success",
    [PatientStatus.Inactive]: "destructive",
    [PatientStatus.Pending]: "warning",
  };
  return <Badge variant={variantMap[status]}>{status}</Badge>;
}
