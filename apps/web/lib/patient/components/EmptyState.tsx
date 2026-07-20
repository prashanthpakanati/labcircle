import React from "react";
import { EmptyState as EmptyStateUI } from "@/components/ui/empty-state";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export default function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <EmptyStateUI
      title={title}
      description={description}
      icon={icon}
      action={action}
    />
  );
}
