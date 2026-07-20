// apps/web/lib/test/components/TestCard.tsx

"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TestStatusBadge from "./TestStatusBadge";
import { Test } from "../models/types";
import { Clock, Tag, FlaskConical } from "lucide-react";

interface TestCardProps {
  test: Test;
}

export default function TestCard({ test }: TestCardProps) {
  return (
    <Card className="border-border shadow-xs hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between p-4 pb-2 space-y-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">{test.displayId}</span>
            <span className="bg-slate-100 text-slate-800 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
              {test.code}
            </span>
          </div>
          <CardTitle className="text-base font-bold leading-tight">{test.name}</CardTitle>
        </div>
        <TestStatusBadge status={test.status} />
      </CardHeader>
      <CardContent className="p-4 pt-2 text-sm space-y-3">
        {/* Metadatas */}
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground border-y border-slate-50 py-2">
          <div className="flex items-center gap-1">
            <FlaskConical className="h-3.5 w-3.5 text-slate-400" />
            <span>{test.department}</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag className="h-3.5 w-3.5 text-slate-400" />
            <span>{test.category}</span>
          </div>
          <div className="flex items-center gap-1 col-span-2">
            <span className="font-semibold text-slate-500">Specimen:</span>
            <span>{test.specimenType} ({test.method})</span>
          </div>
        </div>

        {/* Price & TAT */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>TAT: <strong className="text-slate-700">{test.tatHours} hrs</strong></span>
          </div>
          <div className="text-right space-y-0.5">
            <div className="text-muted-foreground text-[10px] line-through">MRP: ₹{test.mrp}</div>
            <div className="font-bold text-emerald-600">LabCircle: ₹{test.labCirclePrice}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2">
          <Link href={`/tests/${test.id}`} passHref legacyBehavior>
            <Button variant="outline" size="sm" className="w-full text-xs h-9">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
