// apps/web/lib/imaging/components/ServiceList.tsx

import React from "react";
import { ImagingService, ImagingCategory } from "../models/types";
import ServiceCard from "./ServiceCard";

interface ServiceListProps {
  services: ImagingService[];
  categories?: ImagingCategory[];
}

export default function ServiceList({ services, categories = [] }: ServiceListProps) {
  const categoryMap = React.useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((cat) => map.set(cat.id, cat.name));
    return map;
  }, [categories]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {services.map((svc) => (
        <ServiceCard
          key={svc.id}
          service={svc}
          categoryName={categoryMap.get(svc.categoryId)}
        />
      ))}
    </div>
  );
}
