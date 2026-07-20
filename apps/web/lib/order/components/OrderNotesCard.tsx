// apps/web/lib/order/components/OrderNotesCard.tsx

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface OrderNotesCardProps {
  notes?: string;
}

export default function OrderNotesCard({ notes }: OrderNotesCardProps) {
  if (!notes || !notes.trim()) {
    return null;
  }

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <FileText className="h-5 w-5 text-amber-500" />
        <CardTitle className="text-base font-semibold">Clinical & Order Notes</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <p className="text-sm text-slate-800 bg-amber-50/50 p-3 rounded-md border border-amber-200/60 font-normal leading-relaxed">
          {notes}
        </p>
      </CardContent>
    </Card>
  );
}
