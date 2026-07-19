import React, { ReactNode } from 'react';

interface DashboardSectionProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptySubtitle?: string;
  children: ReactNode;
}

export default function DashboardSection({
  title,
  subtitle,
  actionLabel,
  onAction,
  isLoading = false,
  isEmpty = false,
  emptyTitle,
  emptySubtitle,
  children,
}: DashboardSectionProps) {
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="text-sm text-primary-600 hover:underline"
          >
            {actionLabel}
          </button>
        )}
      </div>
      {isLoading ? (
        <div className="animate-pulse">
          {/* Loading placeholder – callers can render their own skeleton if needed */}
          {children}
        </div>
      ) : isEmpty ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium">{emptyTitle ?? 'No data'}</h3>
          {emptySubtitle && <p className="text-sm text-gray-500">{emptySubtitle}</p>}
        </div>
      ) : (
        children
      )}
      <hr className="mt-6 border-gray-200" />
    </section>
  );
}
