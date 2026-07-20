// apps/web/lib/test/components/TestStatusBadge.tsx

import React from "react";
import { Badge } from "@/components/ui/badge";
import { TestStatus } from "../models/enums";

export default function TestStatusBadge({ status }: { status: TestStatus }) {
  const variantMap: Record<TestStatus, Parameters<typeof Badge>[0]["variant"]> = {
    [TestStatus.Active]: "success",
    [TestStatus.Inactive]: "destructive",
  };
  return <Badge variant={variantMap[status]}>{status}</Badge>;
}
