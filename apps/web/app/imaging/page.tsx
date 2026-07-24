// apps/web/app/imaging/page.tsx

"use client";

import React from "react";
import Link from "next/link";
import { useImagingCategories } from "../../lib/imaging/hooks/useImagingCategories";
import { useImagingServices } from "../../lib/imaging/hooks/useImagingServices";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layers, Search, ArrowRight, Activity, Disc, Heart } from "lucide-react";

export default function ImagingLandingPage() {
  const { data: categories, loading: categoriesLoading } = useImagingCategories();
  const { data: services, loading: servicesLoading } = useImagingServices();

  const childCategoriesCount = categories ? categories.filter((c) => c.parentId).length : 0;
  const servicesCount = services ? services.length : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-6 md:p-8 shadow-md">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Diagnostic Imaging Catalog Hub
        </h1>
        <p className="text-sm text-indigo-100/90 max-w-2xl mt-2 leading-relaxed">
          Manage and browse structured radiology diagnostic categories and predefined imaging service libraries. Fully extensible to generic diagnostic offerings.
        </p>
      </header>

      {/* Dynamic quick statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
              Active Imaging Categories
            </span>
            <span className="font-extrabold text-slate-800 text-2xl">
              {categoriesLoading ? "..." : childCategoriesCount}
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl">
            <Search className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
              Predefined Services
            </span>
            <span className="font-extrabold text-slate-800 text-2xl">
              {servicesLoading ? "..." : servicesCount}
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4 sm:col-span-2 lg:col-span-1">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
              Modality Support
            </span>
            <span className="font-extrabold text-slate-800 text-sm md:text-base block mt-0.5 leading-none">
              MRI, CT, Ultrasound, X-Ray
            </span>
          </div>
        </div>
      </div>

      {/* Directory Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200 hover:border-indigo-400 hover:shadow-xs transition-all duration-200 flex flex-col justify-between">
          <CardHeader>
            <div className="p-2.5 bg-slate-50 text-slate-700 w-fit rounded-lg mb-2">
              <Disc className="h-5 w-5 text-indigo-600" />
            </div>
            <CardTitle className="text-lg font-bold text-slate-900">Browse Categories Directory</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Explore dynamic imaging service groupings including MRI, CT Scans, Ultrasound, X-Rays, Mammography, and special women&apos;s/men&apos;s imaging categories.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Link href="/imaging/categories" passHref legacyBehavior>
              <Button className="w-full sm:w-auto text-xs font-semibold gap-1.5" variant="primary">
                Browse Categories
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-slate-200 hover:border-indigo-400 hover:shadow-xs transition-all duration-200 flex flex-col justify-between">
          <CardHeader>
            <div className="p-2.5 bg-slate-50 text-slate-700 w-fit rounded-lg mb-2">
              <Heart className="h-5 w-5 text-indigo-600" />
            </div>
            <CardTitle className="text-lg font-bold text-slate-900">Search Service Catalog</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Search the 500+ predefined diagnostic catalog items with multi-factor filters for fasting protocols, contrast requirements, and imaging modalities.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Link href="/imaging/services" passHref legacyBehavior>
              <Button className="w-full sm:w-auto text-xs font-semibold gap-1.5" variant="primary">
                Search Service Catalog
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
