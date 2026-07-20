// apps/web/lib/test/components/TestTable.tsx

"use client";

import React from "react";
import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import TestStatusBadge from "./TestStatusBadge";
import { Test } from "../models/types";
import { Button } from "@/components/ui/button";

interface TestTableProps {
  tests: Test[];
}

export default function TestTable({ tests }: TestTableProps) {
  if (tests.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="rounded-md border border-border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Test Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Specimen</TableHead>
              <TableHead className="text-right">TAT (hrs)</TableHead>
              <TableHead className="text-right">MRP (₹)</TableHead>
              <TableHead className="text-right">LabCircle (₹)</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-mono text-xs">{t.displayId}</TableCell>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell>
                  <span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded font-mono">
                    {t.code}
                  </span>
                </TableCell>
                <TableCell className="text-sm">{t.department}</TableCell>
                <TableCell className="text-sm">{t.category}</TableCell>
                <TableCell className="text-sm">{t.specimenType}</TableCell>
                <TableCell className="text-right text-sm">{t.tatHours}</TableCell>
                <TableCell className="text-right text-sm">₹{t.mrp.toLocaleString()}</TableCell>
                <TableCell className="text-right text-sm font-semibold text-emerald-600">
                  ₹{t.labCirclePrice.toLocaleString()}
                </TableCell>
                <TableCell className="text-center">
                  <TestStatusBadge status={t.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/tests/${t.id}`} passHref legacyBehavior>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
