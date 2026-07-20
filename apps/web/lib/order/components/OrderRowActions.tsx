// apps/web/lib/order/components/OrderRowActions.tsx

"use client";

import React from "react";
import Link from "next/link";
import { Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderRowActionsProps {
  orderId: string;
}

export default function OrderRowActions({ orderId }: OrderRowActionsProps) {
  return (
    <div className="flex items-center gap-1.5 justify-end">
      <Link href={`/orders/${orderId}`} passHref legacyBehavior>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2 text-xs gap-1"
          title="View Order Details"
          aria-label={`View Order ${orderId}`}
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
      </Link>

      <Link href={`/orders/${orderId}/edit`} passHref legacyBehavior>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2 text-xs gap-1"
          title="Edit Order"
          aria-label={`Edit Order ${orderId}`}
        >
          <Edit className="h-3.5 w-3.5" />
          Edit
        </Button>
      </Link>
    </div>
  );
}
