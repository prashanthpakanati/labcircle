import React from 'react';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onCta?: () => void;
}

// Simple empty state UI used across dashboard widgets.
export default function EmptyState({ title, subtitle, ctaLabel, onCta }: EmptyStateProps) {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
      {ctaLabel && onCta && (
        <button
          onClick={onCta}
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
