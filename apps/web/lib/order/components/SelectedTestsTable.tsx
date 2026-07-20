// apps/web/lib/order/components/SelectedTestsTable.tsx

"use client";

import React from "react";
import { OrderItem } from "../models/types";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

interface SelectedTestsTableProps {
  items: OrderItem[];
  onUpdateQuantity: (testId: string, quantity: number) => void;
  onRemoveItem: (testId: string) => void;
}

export default function SelectedTestsTable({
  items,
  onUpdateQuantity,
  onRemoveItem,
}: SelectedTestsTableProps) {
  if (items.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-muted-foreground border border-dashed rounded-md">
        No tests added to this order yet. Search and select tests above.
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code & Test Name</TableHead>
            <TableHead className="text-right">Price (₹)</TableHead>
            <TableHead className="text-center w-[100px]">Qty</TableHead>
            <TableHead className="text-right">Total (₹)</TableHead>
            <TableHead className="w-[50px] text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.testId}>
              <TableCell className="space-y-0.5">
                <div className="font-semibold text-sm text-slate-900">{item.testName}</div>
                <div className="text-xs text-muted-foreground font-mono">{item.testCode}</div>
              </TableCell>
              <TableCell className="text-right text-sm">
                ₹{item.priceCharged.toLocaleString()}
              </TableCell>
              <TableCell className="text-center">
                <Input
                  type="number"
                  min="1"
                  step="1"
                  value={item.quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    onUpdateQuantity(item.testId, isNaN(val) || val < 1 ? 1 : val);
                  }}
                  className="h-8 w-16 text-center mx-auto text-xs px-1"
                />
              </TableCell>
              <TableCell className="text-right font-semibold text-sm text-slate-900">
                ₹{(item.priceCharged * item.quantity).toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(item.testId)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive/80"
                  title="Remove test"
                  aria-label={`Remove ${item.testName}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
