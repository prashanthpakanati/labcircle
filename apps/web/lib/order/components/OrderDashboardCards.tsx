// apps/web/lib/order/components/OrderDashboardCards.tsx

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Order } from "../models/types";
import { OrderStatus, OrderCollectionType } from "../models/enums";
import { ShoppingBag, Clock, CheckCircle2, Home, IndianRupee } from "lucide-react";

interface OrderDashboardCardsProps {
  orders: Order[];
}

export default function OrderDashboardCards({ orders }: OrderDashboardCardsProps) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const todaysCount = orders.filter((o) => {
    const t = new Date(o.createdAt).getTime();
    return !isNaN(t) && t >= startOfToday;
  }).length;

  const pendingCount = orders.filter((o) => o.status === OrderStatus.Pending).length;
  const completedCount = orders.filter((o) => o.status === OrderStatus.Completed).length;
  const homeCount = orders.filter((o) => o.collectionType === OrderCollectionType.Home).length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const stats = [
    {
      label: "Today's Orders",
      value: todaysCount,
      icon: ShoppingBag,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Pending Orders",
      value: pendingCount,
      icon: Clock,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Completed Orders",
      value: completedCount,
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Home Collection",
      value: homeCount,
      icon: Home,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      color: "text-teal-600 bg-teal-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((s) => {
        const IconComponent = s.icon;
        return (
          <Card key={s.label} className="border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground block">{s.label}</span>
                <span className="text-xl font-bold text-slate-900 font-mono mt-0.5 block">{s.value}</span>
              </div>
              <div className={`p-2.5 rounded-lg ${s.color}`}>
                <IconComponent className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
