// apps/web/lib/imaging/components/ServiceSearch.tsx

import React from "react";
import { ImagingCategory } from "../models/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X, Eye } from "lucide-react";

interface ServiceSearchProps {
  categories: ImagingCategory[];
  searchVal: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (id: string) => void;
  selectedModality: string;
  onModalityChange: (modality: string) => void;
  fastingFilter: string; // "ALL" | "REQUIRED" | "NOT_REQUIRED"
  onFastingChange: (val: string) => void;
  contrastFilter: string; // "ALL" | "REQUIRED" | "NOT_REQUIRED"
  onContrastChange: (val: string) => void;
  showInactive: boolean;
  onToggleInactive: () => void;
  onClearFilters: () => void;
  isFilterActive: boolean;
}

export default function ServiceSearch({
  categories,
  searchVal,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedModality,
  onModalityChange,
  fastingFilter,
  onFastingChange,
  contrastFilter,
  onContrastChange,
  showInactive,
  onToggleInactive,
  onClearFilters,
  isFilterActive,
}: ServiceSearchProps) {
  // Extract unique modalities dynamically from services or use a static list
  const modalities = ["All Modalities", "MRI", "CT Scan", "Ultrasound", "X-Ray", "PET-CT", "Mammography", "DEXA"];

  // Filter sub-categories (non-parents) for category picker
  const subCategories = categories.filter((c) => c.parentId);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      {/* Primary search bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            value={searchVal}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search imaging services by name, code, body part, or keywords..."
            className="pl-9 h-10 text-xs md:text-sm bg-slate-50/50 focus:bg-white"
          />
          {searchVal && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Clear Filters Button */}
        {isFilterActive && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="h-10 text-xs font-semibold gap-1.5 border-dashed border-slate-300 hover:bg-slate-50 text-slate-700"
          >
            <X className="h-3.5 w-3.5" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Extended Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
        {/* Category Picker */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full h-10 border border-slate-200 rounded-lg px-3 py-1 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Categories</option>
            {subCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Modality Picker */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Modality
          </label>
          <select
            value={selectedModality}
            onChange={(e) => onModalityChange(e.target.value)}
            className="w-full h-10 border border-slate-200 rounded-lg px-3 py-1 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {modalities.map((mod) => (
              <option key={mod} value={mod === "All Modalities" ? "ALL" : mod}>
                {mod}
              </option>
            ))}
          </select>
        </div>

        {/* Fasting Toggle */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Fasting Requirement
          </label>
          <select
            value={fastingFilter}
            onChange={(e) => onFastingChange(e.target.value)}
            className="w-full h-10 border border-slate-200 rounded-lg px-3 py-1 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Fasting (Any)</option>
            <option value="REQUIRED">Fasting Required</option>
            <option value="NOT_REQUIRED">No Fasting Required</option>
          </select>
        </div>

        {/* Contrast Toggle */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Contrast Scan
          </label>
          <select
            value={contrastFilter}
            onChange={(e) => onContrastChange(e.target.value)}
            className="w-full h-10 border border-slate-200 rounded-lg px-3 py-1 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Contrast (Any)</option>
            <option value="REQUIRED">Contrast Required</option>
            <option value="NOT_REQUIRED">No Contrast Required</option>
          </select>
        </div>
      </div>

      {/* Admin Activation Checkbox */}
      <div className="flex items-center justify-between pt-2 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <span>Advanced Diagnostic Filters</span>
        </div>

        <button
          onClick={onToggleInactive}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            showInactive
              ? "bg-slate-900 border-slate-900 text-white"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <Eye className="h-3.5 w-3.5" />
          {showInactive ? "Showing Inactive Services" : "Show Inactive Services"}
        </button>
      </div>
    </div>
  );
}
