"use client";
import React, { useState, useMemo } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import PatientStatusBadge from "./PatientStatusBadge";
import { Patient } from "../models/types";

interface PatientTableProps {
  patients: Patient[];
  pageSize?: number;
}

export default function PatientTable({ patients, pageSize = 10 }: PatientTableProps) {
  const [page, setPage] = useState(1);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return patients.slice(start, start + pageSize);
  }, [patients, page, pageSize]);

  const totalPages = Math.ceil(patients.length / pageSize);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.displayId}</TableCell>
              <TableCell>{p.firstName} {p.lastName}</TableCell>
              <TableCell><PatientStatusBadge status={p.status} /></TableCell>
              <TableCell className="text-right">
                <Badge variant="outline">View</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Simple pagination controls */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          className="px-2 py-1 text-sm border rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="px-2 py-1 text-sm">Page {page} of {totalPages}</span>
        <button
          className="px-2 py-1 text-sm border rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
