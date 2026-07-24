// apps/web/lib/imaging/components/EmptyState.tsx

import React from "react";
import { Search } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl text-center">
      <div className="p-3 bg-slate-100 rounded-full text-slate-400 mb-4">
        <Search className="h-6 w-6" />
      </div>
      <h3 className="font-bold text-slate-800 text-sm md:text-base">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-6 leading-relaxed">
        {description}
      </p>
      {action}
    </div>
  );
}
