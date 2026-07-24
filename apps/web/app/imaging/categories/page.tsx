// apps/web/app/imaging/categories/page.tsx

"use client";

import React from "react";
import Link from "next/link";
import { useImagingCategories } from "../../../lib/imaging/hooks/useImagingCategories";
import CategoryGrid from "../../../lib/imaging/components/CategoryGrid";
import LoadingSkeleton from "../../../lib/imaging/components/LoadingSkeleton";
import ErrorState from "../../../lib/imaging/components/ErrorState";
import EmptyState from "../../../lib/imaging/components/EmptyState";
import { ArrowLeft } from "lucide-react";

export default function BrowseCategoriesPage() {
  const { data: categories, loading, error, refetch } = useImagingCategories();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Navigation & Header */}
      <div className="space-y-4">
        <Link
          href="/imaging"
          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-slate-800 transition-colors"
          aria-label="Back to Imaging Hub"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          Back to Imaging Hub
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Imaging Categories
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Browse our hierarchical database of diagnostic scan categories.
          </p>
        </div>
      </div>

      {/* Render states */}
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : !categories || categories.length === 0 ? (
        <EmptyState
          title="No Categories Available"
          description="There are currently no active categories configured in the database catalog."
        />
      ) : (
        <CategoryGrid categories={categories} />
      )}
    </div>
  );
}
