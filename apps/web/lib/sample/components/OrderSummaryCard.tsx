// apps/web/lib/sample/components/OrderSummaryCard.tsx

"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Order } from "../../order/models/types";
import { Patient } from "../../patient/models/types";
import { FileText, User, Calendar, MapPin, Phone } from "lucide-react";

interface OrderSummaryCardProps {
  order: Order;
  patient: Patient | null;
}

export default function OrderSummaryCard({ order, patient }: OrderSummaryCardProps) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-base font-semibold">Order & Patient Summary</CardTitle>
          </div>
          <Badge variant="outline">{order.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {/* Order Details */}
        <div className="p-3 bg-slate-50 rounded-lg space-y-2 border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Order ID</span>
            <span className="font-mono font-semibold text-slate-900">{order.displayId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Collection Type</span>
            <span className="font-medium text-slate-800">{order.collectionType}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Total Amount</span>
            <span className="font-semibold text-slate-900">₹{order.total}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Created Date
            </span>
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Patient Details */}
        {patient ? (
          <div className="p-3 bg-blue-50/50 rounded-lg space-y-2 border border-blue-100">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <User className="h-4 w-4 text-blue-600" />
                {patient.firstName} {patient.lastName}
              </span>
              <span className="text-xs font-mono text-muted-foreground">{patient.displayId}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-1">
              <div className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                <span>{patient.phone}</span>
              </div>
              <div>Gender: <span className="font-medium text-slate-700">{patient.gender}</span></div>
              {patient.city && (
                <div className="col-span-2 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{patient.address ? `${patient.address}, ` : ""}{patient.city}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">Patient details unavailable</p>
        )}
      </CardContent>
    </Card>
  );
}
