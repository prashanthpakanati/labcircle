// apps/web/lib/order/components/OrdersTable.tsx

import React from "react";
import { Order } from "../models/types";
import { Patient } from "../../patient/models/types";
import OrderStatusBadge from "./OrderStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";
import OrderRowActions from "./OrderRowActions";
import { OrderCollectionType } from "../models/enums";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

interface OrdersTableProps {
  orders: Order[];
  patientMap: Map<string, Patient>;
}

export default function OrdersTable({ orders, patientMap }: OrdersTableProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
  };

  return (
    <div className="rounded-md border border-border bg-white overflow-hidden hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Display ID</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Collection</TableHead>
            <TableHead className="text-right">Grand Total</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const patient = patientMap.get(order.patientId);
            const patientName = patient ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient";
            const patientPhone = patient ? patient.phone : "";

            return (
              <TableRow key={order.id}>
                <TableCell className="font-mono font-bold text-xs text-slate-900">
                  {order.displayId}
                </TableCell>
                <TableCell>
                  <span className="font-medium text-sm text-slate-900 block">{patientName}</span>
                  {patientPhone && (
                    <span className="text-xs text-muted-foreground font-mono">{patientPhone}</span>
                  )}
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell>
                  <PaymentStatusBadge status={order.paymentStatus} />
                </TableCell>
                <TableCell className="text-xs font-medium text-slate-800">
                  {order.collectionType === OrderCollectionType.Home ? "Home Collection" : "Walk-in (Lab)"}
                </TableCell>
                <TableCell className="text-right font-semibold text-sm text-slate-900">
                  ₹{order.total.toLocaleString()}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground font-mono">
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <OrderRowActions orderId={order.id} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
