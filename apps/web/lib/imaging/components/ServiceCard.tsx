// apps/web/lib/imaging/components/ServiceCard.tsx

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImagingService } from "../models/types";
import { Clock, FileText, CheckCircle, ShieldAlert, Sparkles, Flame } from "lucide-react";

interface ServiceCardProps {
  service: ImagingService;
  categoryName?: string;
}

export default function ServiceCard({ service, categoryName }: ServiceCardProps) {
  return (
    <Card className="border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all duration-200 h-full flex flex-col overflow-hidden group">
      {/* Thumbnail area / placeholder */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden flex items-center justify-center border-b border-slate-100">
        {service.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={service.thumbnail}
            alt={service.serviceName}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
            <span className="font-bold text-sm tracking-widest text-indigo-400 font-mono block mb-1">
              {service.modality}
            </span>
            <span className="text-[10px] text-slate-500 uppercase">{service.bodyPart}</span>
          </div>
        )}

        {/* Action badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {service.featured && (
            <Badge className="bg-amber-500 hover:bg-amber-500 text-white font-semibold text-[10px] px-2 py-0.5 border-none flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Featured
            </Badge>
          )}
          {service.popular && (
            <Badge className="bg-rose-500 hover:bg-rose-500 text-white font-semibold text-[10px] px-2 py-0.5 border-none flex items-center gap-1">
              <Flame className="h-3 w-3" /> Popular
            </Badge>
          )}
        </div>

        {/* Modality tag */}
        <div className="absolute bottom-2 right-2">
          <Badge className="bg-slate-900/80 backdrop-blur-xs text-white border-none font-mono text-[10px] px-2 py-0.5">
            {service.modality}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {categoryName && (
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 block">
              {categoryName}
            </span>
          )}
          
          <Link href={`/imaging/services/${service.id}`} passHref legacyBehavior>
            <a className="focus:outline-none">
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors duration-150 text-sm md:text-base leading-snug line-clamp-1">
                {service.serviceName}
              </h3>
            </a>
          </Link>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {service.description}
          </p>

          {/* Guidelines quick indicators */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {service.preparation.fastingRequired ? (
              <Badge variant="secondary" className="bg-orange-50 text-orange-700 hover:bg-orange-50 text-[10px] px-1.5 py-0.5 border-orange-100 flex items-center gap-1 font-medium">
                <ShieldAlert className="h-3 w-3" /> Fasting Required ({service.preparation.fastingHours || 6}h)
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 text-[10px] px-1.5 py-0.5 border-emerald-100 flex items-center gap-1 font-medium">
                <CheckCircle className="h-3 w-3" /> No Fasting
              </Badge>
            )}

            {service.preparation.contrastRequired && (
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 text-[10px] px-1.5 py-0.5 border-blue-100 flex items-center gap-1 font-medium">
                Contrast
              </Badge>
            )}

            {service.preparation.removeMetalObjects && (
              <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-50 text-[10px] px-1.5 py-0.5 border-purple-100 flex items-center gap-1 font-medium">
                No Metal
              </Badge>
            )}
          </div>
        </div>

        {/* Footer info: Duration and TAT */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4 text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {service.durationMinutes} Mins
          </span>
          <span className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5 text-slate-400" />
            {service.reportTatHours} Hrs Turnaround
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
