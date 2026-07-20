// apps/web/lib/sample/components/OrderSelector.tsx

"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOrders } from "../../order/hooks/useOrders";
import { usePatients } from "../../patient/hooks/usePatients";
import { Order } from "../../order/models/types";
import { Patient } from "../../patient/models/types";
import { FileText, Search, CheckCircle2, RefreshCw, User } from "lucide-react";

interface OrderSelectorProps {
  selectedOrder: Order | null;
  onSelectOrder: (order: Order | null, patient: Patient | null) => void;
  error?: string;
}

export default function OrderSelector({
  selectedOrder,
  onSelectOrder,
  error,
}: OrderSelectorProps) {
  const { data: orders, loading: ordersLoading, error: ordersError } = useOrders();
  const { data: patients, loading: patientsLoading, error: patientsError } = usePatients();
  const [searchQuery, setSearchQuery] = useState("");

  const patientMap = useMemo(() => {
    const map = new Map<string, Patient>();
    if (patients) {
      patients.forEach((p) => map.set(p.id, p));
    }
    return map;
  }, [patients]);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    // Only allow selecting orders that are active/eligible (e.g. Pending, Processing)
    const activeOrders = orders.filter((o) => o.status !== "Cancelled");

    if (!searchQuery.trim()) return activeOrders.slice(0, 5);

    const q = searchQuery.toLowerCase().trim();
    return activeOrders
      .filter((o) => {
        const patient = patientMap.get(o.patientId);
        const matchDisplayId = o.displayId.toLowerCase().includes(q);
        const matchPatientName = patient
          ? `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(q)
          : false;
        const matchPatientPhone = patient ? patient.phone.includes(q) : false;

        return matchDisplayId || matchPatientName || matchPatientPhone;
      })
      .slice(0, 5);
  }, [orders, patientMap, searchQuery]);

  const isLoading = ordersLoading || patientsLoading;
  const isError = ordersError || patientsError;

  const selectedPatient = selectedOrder ? patientMap.get(selectedOrder.patientId) : null;

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-emerald-600" />
          <CardTitle className="text-base font-semibold">1. Select Order</CardTitle>
        </div>
        {selectedOrder && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectOrder(null, null)}
            className="h-8 text-xs gap-1"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Change Order
          </Button>
        )}
      </CardHeader>

      <CardContent className="pt-2 space-y-4">
        {selectedOrder ? (
          <div className="flex items-center justify-between p-4 bg-emerald-50/50 border border-emerald-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-full text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-900">{selectedOrder.displayId}</h4>
                  <Badge variant="outline" className="text-xs">
                    {selectedOrder.status}
                  </Badge>
                </div>
                {selectedPatient ? (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Patient: <span className="font-medium text-slate-800">{selectedPatient.firstName} {selectedPatient.lastName}</span> ({selectedPatient.phone})
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Patient ID: {selectedOrder.patientId}
                  </p>
                )}
                <p className="text-xs text-muted-foreground font-mono">
                  {selectedOrder.items.length} Test{selectedOrder.items.length === 1 ? "" : "s"} • Total: ₹{selectedOrder.total}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search order by Order ID, Patient Name, or Phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                aria-label="Search order by ID, patient name, or phone"
              />
            </div>

            {isLoading ? (
              <p className="text-xs text-muted-foreground py-2">Loading orders...</p>
            ) : isError ? (
              <p className="text-xs text-destructive py-2">Failed to load orders.</p>
            ) : filteredOrders.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">No matching orders found.</p>
            ) : (
              <div className="divide-y border border-border rounded-md overflow-hidden bg-white">
                {filteredOrders.map((o) => {
                  const patient = patientMap.get(o.patientId);
                  return (
                    <div
                      key={o.id}
                      onClick={() => onSelectOrder(o, patient || null)}
                      className="flex items-center justify-between p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onSelectOrder(o, patient || null);
                        }
                      }}
                      aria-label={`Select order ${o.displayId}`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-slate-900">
                            {o.displayId}
                          </span>
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            {o.status}
                          </Badge>
                        </div>
                        {patient && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <User className="h-3 w-3 inline" />
                            <span>{patient.firstName} {patient.lastName}</span>
                            <span className="font-mono">({patient.phone})</span>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground font-mono">
                          {o.items.map((i) => i.testName).join(", ")}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        Select
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {error && <p className="text-xs text-destructive font-medium">{error}</p>}
      </CardContent>
    </Card>
  );
}
