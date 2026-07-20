// apps/web/lib/order/components/OrderedTestsCard.tsx

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { OrderItem } from "../models/types";
import { FlaskConical } from "lucide-react";

interface OrderedTestsCardProps {
  items: OrderItem[];
}

export default function OrderedTestsCard({ items }: OrderedTestsCardProps) {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <FlaskConical className="h-5 w-5 text-indigo-500" />
        <CardTitle className="text-base font-semibold">Ordered Diagnostic Tests</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="rounded-md border border-border bg-white overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code & Test Name</TableHead>
                <TableHead className="text-right">Unit Price (₹)</TableHead>
                <TableHead className="text-center w-[80px]">Qty</TableHead>
                <TableHead className="text-right">Line Total (₹)</TableHead>
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
                  <TableCell className="text-center text-sm font-medium">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-sm text-slate-900">
                    ₹{(item.priceCharged * item.quantity).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
