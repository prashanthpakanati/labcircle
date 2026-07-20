// apps/web/lib/test/components/TestStatistics.tsx

"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TestStats } from "../hooks/useTestStats";
import { ClipboardList, CheckCircle2, AlertTriangle, Layers, Building2 } from "lucide-react";

interface TestStatisticsProps {
  stats: TestStats;
}

export default function TestStatistics({ stats }: TestStatisticsProps) {
  const { total, active, inactive, categoryCount, departmentCount } = stats;

  const statItems = [
    {
      title: "Total Tests",
      value: total,
      icon: ClipboardList,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      description: "Total defined tests in catalog"
    },
    {
      title: "Active Tests",
      value: active,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      description: "Available for ordering"
    },
    {
      title: "Inactive Tests",
      value: inactive,
      icon: AlertTriangle,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      description: "Temporarily suspended"
    },
    {
      title: "Categories",
      value: categoryCount,
      icon: Layers,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      description: "Active classification groups"
    },
    {
      title: "Departments",
      value: departmentCount,
      icon: Building2,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      description: "Assigned lab departments"
    }
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {statItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Card key={idx} className="overflow-hidden border-border hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${item.bg}`}>
                <Icon className={`h-4 w-4 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight mb-1">{item.value}</div>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
