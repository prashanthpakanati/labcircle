// apps/web/lib/sample/components/LoadingSkeleton.tsx

"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-label="Loading sample details">
      <div className="h-16 bg-slate-200 rounded-lg w-full" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border">
            <CardHeader className="h-10 bg-slate-100 rounded-t-lg" />
            <CardContent className="h-32 p-4" />
          </Card>
          <Card className="border-border">
            <CardHeader className="h-10 bg-slate-100 rounded-t-lg" />
            <CardContent className="h-48 p-4" />
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border">
            <CardHeader className="h-10 bg-slate-100 rounded-t-lg" />
            <CardContent className="h-40 p-4" />
          </Card>
          <Card className="border-border">
            <CardHeader className="h-10 bg-slate-100 rounded-t-lg" />
            <CardContent className="h-36 p-4" />
          </Card>
        </div>
      </div>
    </div>
  );
}
