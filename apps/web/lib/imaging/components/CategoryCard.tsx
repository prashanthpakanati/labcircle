// apps/web/lib/imaging/components/CategoryCard.tsx

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ImagingCategory } from "../models/types";
import * as Lucide from "lucide-react";

interface CategoryCardProps {
  category: ImagingCategory;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  // Dynamically resolve icon, fallback to Scan
  const IconComponent = (Lucide as unknown as Record<string, React.ComponentType<{ className?: string }>>)[category.icon] || Lucide.Scan;

  return (
    <Link href={`/imaging/services?categoryId=${category.id}`} passHref legacyBehavior>
      <a className="group block focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl transition-all duration-200">
        <Card className="border border-slate-200 group-hover:border-indigo-400 group-hover:shadow-md h-full transition-all duration-200">
          <CardContent className="p-5 flex flex-col items-start gap-4">
            <div className="p-3 bg-indigo-50 group-hover:bg-indigo-100 text-indigo-600 rounded-xl transition-colors duration-200">
              <IconComponent className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors duration-200 text-sm md:text-base">
                {category.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                {category.description || `Browse ${category.name} imaging services.`}
              </p>
            </div>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}
