// PromotionalBannerCard.tsx
// Stateless presentation component for a promotional banner.

import React from "react";
import DashboardCard from "./DashboardCard";
import EmptyState from "./EmptyState";

export interface PromotionalBannerProps {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onCta?: () => void;
  imageUrl?: string; // optional background image
  isLoading?: boolean;
}

export default function PromotionalBannerCard({ title, subtitle, ctaLabel, onCta, imageUrl, isLoading = false }: PromotionalBannerProps) {
  const hasContent = !isLoading && (title || subtitle || ctaLabel);

  return (
    <DashboardCard title="Promotions">
      {isLoading ? (
        <div className="h-32 bg-gray-200 rounded animate-pulse" />
      ) : !hasContent ? (
        <EmptyState title="No promotions" subtitle="Check back later for offers." />
      ) : (
        <div
          className="relative rounded overflow-hidden"
          style={imageUrl ? { backgroundImage: `url(${imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
        >
          <div className="bg-black bg-opacity-50 p-4 text-white">
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            {subtitle && <p className="text-sm mb-2">{subtitle}</p>}
            {ctaLabel && onCta && (
              <button
                onClick={onCta}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded text-white"
              >
                {ctaLabel}
              </button>
            )}
          </div>
        </div>
      )}
    </DashboardCard>
  );
}
