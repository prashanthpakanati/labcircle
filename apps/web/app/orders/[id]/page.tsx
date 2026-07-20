// apps/web/app/orders/[id]/page.tsx
"use client";

import React from "react";

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailsPlaceholderPage({ params }: OrderDetailsPageProps) {
  const resolvedParams = React.use(params);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order Details (ID: {resolvedParams.id})</h1>
      <p className="text-muted-foreground">
        Placeholder route for order details. Business logic and UI components will be implemented in subsequent milestones.
      </p>
    </div>
  );
}
