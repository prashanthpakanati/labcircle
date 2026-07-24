// apps/web/app/imaging/services/[id]/page.tsx

"use client";

import React from "react";
import Link from "next/link";
import { useImagingService } from "../../../../lib/imaging/hooks/useImagingService";
import { useImagingCategory } from "../../../../lib/imaging/hooks/useImagingCategory";
import ServiceDetailsCard from "../../../../lib/imaging/components/ServiceDetailsCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

interface ServiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { id } = React.use(params);

  // Load service details
  const { data: service, loading: serviceLoading, error: serviceError, refetch } = useImagingService(id);

  // Load category details once service is fetched
  const { data: category } = useImagingCategory(service?.categoryId || "");

  if (serviceLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-slate-500 gap-3">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        <span className="text-xs font-semibold">Retrieving diagnostic metadata...</span>
      </div>
    );
  }

  if (serviceError) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-4">
        <header className="py-2 border-b border-slate-100">
          <Link
            href="/imaging/services"
            className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Services Catalog
          </Link>
        </header>
        <div className="p-8 bg-red-50/30 border border-red-100 rounded-xl text-center space-y-4">
          <h3 className="font-bold text-red-950 text-base">Error Loading Diagnostic Service</h3>
          <p className="text-xs text-red-700 max-w-sm mx-auto">{serviceError.message}</p>
          <Button onClick={refetch} variant="outline" size="sm" className="border-red-200 text-red-800 hover:bg-red-50 text-xs">
            Retry Loading
          </Button>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-4">
        <header className="py-2 border-b border-slate-100">
          <Link
            href="/imaging/services"
            className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-slate-800"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Services Catalog
          </Link>
        </header>
        <div className="p-12 border border-dashed border-slate-200 rounded-xl text-center text-slate-500">
          <h3 className="font-bold text-slate-800 text-base">Diagnostic Service Not Found</h3>
          <p className="text-xs text-muted-foreground mt-1">
            No diagnostic imaging service with ID or slug &quot;{id}&quot; exists in the catalog registry.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Navigation & Header */}
      <div className="space-y-2">
        <Link
          href="/imaging/services"
          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-slate-800 transition-colors"
          aria-label="Back to Services Catalog"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          Back to Services Catalog
        </Link>
      </div>

      {/* Main Details View Wrapper */}
      <ServiceDetailsCard service={service} category={category} />
    </div>
  );
}
