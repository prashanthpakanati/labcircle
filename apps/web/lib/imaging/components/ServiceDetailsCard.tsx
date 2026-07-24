// apps/web/lib/imaging/components/ServiceDetailsCard.tsx

import React from "react";
import { ImagingService, ImagingCategory } from "../models/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Sparkles,
  Layers,
  Compass,
  FileWarning,
  CheckSquare,
  HelpCircle,
} from "lucide-react";

interface ServiceDetailsCardProps {
  service: ImagingService;
  category?: ImagingCategory | null;
}

export default function ServiceDetailsCard({ service, category }: ServiceDetailsCardProps) {
  const prep = service.preparation;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Area (7 cols): Service Overview & Primary Info */}
      <div className="lg:col-span-7 space-y-6">
        <Card className="border border-slate-200">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="primary" className="font-mono text-[10px]">
                {service.serviceCode}
              </Badge>
              {category && (
                <Badge variant="secondary" className="text-[10px]">
                  {category.name}
                </Badge>
              )}
              {service.featured && (
                <Badge className="bg-amber-500 hover:bg-amber-500 text-white text-[10px] flex items-center gap-0.5 border-none">
                  <Sparkles className="h-3 w-3" /> Featured
                </Badge>
              )}
              {service.popular && (
                <Badge className="bg-rose-500 hover:bg-rose-500 text-white text-[10px] flex items-center gap-0.5 border-none">
                  <Flame className="h-3 w-3" /> Popular
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">
              {service.serviceName}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Image banner */}
            {service.thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={service.thumbnail}
                alt={service.serviceName}
                className="w-full h-56 md:h-64 object-cover rounded-lg border border-slate-100"
              />
            )}

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Service Description
              </h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal">
                {service.description}
              </p>
            </div>

            {/* Core parameters metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-100 pt-5">
              <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Modality</span>
                <span className="font-bold text-slate-800 text-xs md:text-sm flex items-center gap-1">
                  <Compass className="h-3.5 w-3.5 text-indigo-500" />
                  {service.modality}
                </span>
              </div>

              <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Target Body Part</span>
                <span className="font-bold text-slate-800 text-xs md:text-sm flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5 text-indigo-500" />
                  {service.bodyPart}
                </span>
              </div>

              <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Scan Duration</span>
                <span className="font-bold text-slate-800 text-xs md:text-sm flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-indigo-500" />
                  {service.durationMinutes} Mins
                </span>
              </div>

              <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Report TAT</span>
                <span className="font-bold text-slate-800 text-xs md:text-sm flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5 text-indigo-500" />
                  {service.reportTatHours} Hrs
                </span>
              </div>
            </div>

            {/* Search Aliases / Keywords */}
            {(service.aliases?.length > 0 || service.keywords?.length > 0) && (
              <div className="border-t border-slate-100 pt-5 space-y-3">
                {service.aliases?.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Common Synonyms
                    </span>
                    <p className="text-xs text-slate-600 italic">
                      {service.aliases.join(", ")}
                    </p>
                  </div>
                )}

                {service.keywords?.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Keywords
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {service.keywords.map((k, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] font-medium py-0">
                          {k}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Area (5 cols): Structured Preparation Guidelines */}
      <div className="lg:col-span-5 space-y-6">
        <Card className="border border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-600" />
              Patient Preparation Guide
            </CardTitle>
          </CardHeader>

          <CardContent className="p-5 space-y-5">
            {/* Quick check indicators */}
            <div className="space-y-3">
              {/* Fasting Guideline */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                {prep.fastingRequired ? (
                  <>
                    <ShieldAlert className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800 text-xs block">Fasting Required</span>
                      <span className="text-xs text-slate-600">
                        Do not consume food or beverages for at least{" "}
                        <strong className="text-slate-800">{prep.fastingHours || 6} hours</strong> prior to your scan.
                        {prep.waterAllowed ? " Water is permitted." : " Do not drink water."}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800 text-xs block">No Fasting Required</span>
                      <span className="text-xs text-slate-600">
                        You may eat and drink normally before this scan procedure.
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Contrast Guideline */}
              {prep.contrastRequired && (
                <div className="flex items-start gap-3 p-3 bg-blue-50/40 rounded-lg border border-blue-100">
                  <ShieldAlert className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-blue-900 text-xs block">Contrast Agent Scan</span>
                    <span className="text-xs text-blue-700">
                      Requires injection/consumption of contrast dye. Kidney function tests (Serum Creatinine) may be checked first.
                    </span>
                  </div>
                </div>
              )}

              {/* Metallic Objects Warning */}
              {prep.removeMetalObjects && (
                <div className="flex items-start gap-3 p-3 bg-purple-50/40 rounded-lg border border-purple-100">
                  <ShieldAlert className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-purple-900 text-xs block">Remove All Metallic Objects</span>
                    <span className="text-xs text-purple-700">
                      Remove hairpins, jewelry, watches, piercing studs, and clothing with metal zippers before entering.
                    </span>
                  </div>
                </div>
              )}

              {/* Pregnancy Warning */}
              {prep.pregnancyWarning && (
                <div className="flex items-start gap-3 p-3 bg-rose-50/40 rounded-lg border border-rose-100">
                  <FileWarning className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-rose-900 text-xs block">Pregnancy Contraindication</span>
                    <span className="text-xs text-rose-700 font-medium">
                      This diagnostic scan uses ionizing radiation/high-strength fields. Inform the radiologist immediately if you are pregnant or suspect pregnancy.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Medication Instructions */}
            {prep.medicationInstructions && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Medication Instructions
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {prep.medicationInstructions}
                </p>
              </div>
            )}

            {/* Document requirements */}
            {prep.documentRequirements && prep.documentRequirements.length > 0 && (
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Mandatory Documents to Carry
                </span>
                <ul className="space-y-1.5">
                  {prep.documentRequirements.map((doc, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckSquare className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Additional instructions */}
            {prep.additionalInstructions && (
              <div className="space-y-1.5 border-t border-slate-100 pt-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                  <HelpCircle className="h-3.5 w-3.5 text-slate-400" /> Additional Guidance
                </span>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {prep.additionalInstructions}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
