// apps/web/lib/imaging/components/CategoryGrid.tsx

import React from "react";
import { ImagingCategory } from "../models/types";
import CategoryCard from "./CategoryCard";

interface CategoryGridProps {
  categories: ImagingCategory[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  // Separate top-level categories from sub-categories
  const parentCategories = categories.filter((c) => !c.parentId);
  const childCategories = categories.filter((c) => c.parentId);

  // Group child categories by their parentId
  const childrenMap = React.useMemo(() => {
    const map = new Map<string, ImagingCategory[]>();
    childCategories.forEach((c) => {
      if (c.parentId) {
        const list = map.get(c.parentId) || [];
        list.push(c);
        map.set(c.parentId, list);
      }
    });
    return map;
  }, [childCategories]);

  // If there are no parent categories (fallback to flat structure)
  if (parentCategories.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {parentCategories.map((parent) => {
        const subCats = childrenMap.get(parent.id) || [];
        if (subCats.length === 0) return null;

        return (
          <section key={parent.id} className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span className="w-1.5 h-5 bg-indigo-600 rounded-sm"></span>
                {parent.name}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5 ml-3.5">
                {parent.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {subCats.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
