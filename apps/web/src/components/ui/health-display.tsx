import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";

// 1. METRIC CARD Component
export interface MetricCardProps {
  label: string;
  value: string | number;
  unit: string;
  referenceRange: string;
  status: "normal" | "abnormal" | "critical";
  className?: string;
}
export function MetricCard({
  label,
  value,
  unit,
  referenceRange,
  status,
  className,
}: MetricCardProps) {
  const statusStyles = {
    normal: "border-slate-200 text-slate-800",
    abnormal: "border-amber-200 bg-amber-50/10 text-amber-800",
    critical: "border-red-200 bg-red-50/10 text-red-800",
  };

  const statusBadge = {
    normal: <Badge variant="secondary">Normal</Badge>,
    abnormal: <Badge variant="warning">Abnormal</Badge>,
    critical: <Badge variant="destructive">Critical</Badge>,
  };

  return (
    <Card
      className={cn(
        "border shadow-2xs transition-shadow hover:shadow-xs",
        statusStyles[status],
        className,
      )}
    >
      <CardContent className="flex flex-col gap-2 p-5">
        <div className="flex items-center justify-between text-xs font-medium tracking-wider text-slate-500 uppercase">
          <span>{label}</span>
          {statusBadge[status]}
        </div>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-3xl font-bold tracking-tight text-slate-900">{value}</span>
          <span className="text-sm font-semibold text-slate-500">{unit}</span>
        </div>
        <div className="text-xs font-medium text-slate-400">Ref: {referenceRange}</div>
      </CardContent>
    </Card>
  );
}

// 2. STATISTIC CARD Component
export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}
export function StatCard({ title, value, description, icon, className }: StatCardProps) {
  return (
    <Card className={cn("border bg-white shadow-2xs", className)}>
      <CardContent className="flex items-start justify-between p-5">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            {title}
          </span>
          <span className="text-3xl font-bold tracking-tight text-slate-900">{value}</span>
          {description && <span className="mt-0.5 text-xs text-slate-400">{description}</span>}
        </div>
        {icon && (
          <div className="border-border rounded-lg border bg-slate-50 p-2.5 text-slate-400">
            {icon}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// 3. HEALTH GAUGE Component
export interface HealthGaugeProps {
  value: number;
  minRange: number;
  maxRange: number;
  lowLimit?: number;
  highLimit?: number;
  className?: string;
}
export function HealthGauge({
  value,
  minRange,
  maxRange,
  lowLimit = 30,
  highLimit = 70,
  className,
}: HealthGaugeProps) {
  // Calculate percentage placement
  const percentage = Math.min(Math.max(((value - minRange) / (maxRange - minRange)) * 100, 0), 100);

  return (
    <div className={cn("flex w-full flex-col gap-2 py-2", className)}>
      {/* Gauge bar */}
      <div className="border-border/40 relative h-2 w-full overflow-hidden rounded-full border bg-slate-100">
        {/* Normal range highlight wrapper */}
        <div
          className="absolute h-full bg-green-500/25"
          style={{ left: `${lowLimit}%`, right: `${100 - highLimit}%` }}
        />
        {/* Pointer indicator */}
        <div
          className="absolute top-0 bottom-0 -ml-0.75 w-1.5 rounded-full border border-white bg-slate-900 shadow-xs"
          style={{ left: `${percentage}%` }}
        />
      </div>
      {/* Labels */}
      <div className="text-3xs flex justify-between font-semibold tracking-wider text-slate-400 uppercase select-none">
        <span>Low ({minRange})</span>
        <span className="font-bold text-green-600">Normal</span>
        <span>High ({maxRange})</span>
      </div>
    </div>
  );
}

// 4. TIMELINE Component
export interface TimelineItem {
  title: string;
  description?: string;
  time?: string;
  isCompleted?: boolean;
}
export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}
export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <div key={idx} className="flex min-h-[72px] gap-4">
            {/* Steps line indicators */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "text-2xs flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-semibold select-none",
                  item.isCompleted
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-slate-300 bg-white text-slate-400",
                )}
              >
                {item.isCompleted ? "✓" : idx + 1}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "my-1 w-0.5 grow",
                    item.isCompleted ? "bg-green-500" : "bg-slate-200",
                  )}
                />
              )}
            </div>
            {/* Details */}
            <div className="flex flex-col pb-6">
              <span
                className={cn(
                  "text-sm font-semibold",
                  item.isCompleted ? "text-slate-900" : "text-slate-500",
                )}
              >
                {item.title}
              </span>
              {item.description && (
                <span className="mt-0.5 text-xs text-slate-400">{item.description}</span>
              )}
              {item.time && (
                <span className="text-3xs mt-1 font-medium text-slate-400 uppercase">
                  {item.time}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 5. PROGRESS STEPPER Component
export interface ProgressStepperProps {
  steps: string[];
  currentStepIndex: number;
  className?: string;
}
export function ProgressStepper({ steps, currentStepIndex, className }: ProgressStepperProps) {
  return (
    <div className={cn("flex w-full items-center justify-between gap-4 select-none", className)}>
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStepIndex;
        const isActive = idx === currentStepIndex;
        const isLast = idx === steps.length - 1;

        return (
          <React.Fragment key={idx}>
            <div className="flex shrink-0 items-center gap-2">
              <div
                className={cn(
                  "text-3xs flex h-6 w-6 items-center justify-center rounded-full border font-bold",
                  isCompleted && "border-slate-900 bg-slate-900 text-white",
                  isActive && "bg-primary border-primary ring-primary/20 text-slate-900 ring-2",
                  !isCompleted && !isActive && "border-slate-300 bg-white text-slate-400",
                )}
              >
                {isCompleted ? "✓" : idx + 1}
              </div>
              <span
                className={cn(
                  "hidden text-xs font-semibold sm:inline",
                  isActive && "text-slate-900",
                  !isActive && "text-slate-400",
                )}
              >
                {step}
              </span>
            </div>
            {!isLast && (
              <div
                className={cn(
                  "h-0.5 w-full grow rounded-full",
                  isCompleted ? "bg-slate-900" : "bg-slate-200",
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// 6. REPORT STATUS Component
export interface ReportStatusProps {
  isSigned: boolean;
  signedBy?: string;
  signedAt?: string;
  className?: string;
}
export function ReportStatus({ isSigned, signedBy, signedAt, className }: ReportStatusProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-lg border bg-white p-4 sm:flex-row sm:items-center sm:justify-between",
        isSigned ? "border-green-200/60 bg-green-50/10" : "border-amber-200/60 bg-amber-50/10",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "rounded-lg border p-2",
            isSigned
              ? "border-green-300 bg-green-100 text-green-700"
              : "border-amber-300 bg-amber-100 text-amber-700",
          )}
        >
          {isSigned ? (
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          )}
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-slate-800">
            {isSigned ? "Report Signed & Approved" : "Pending Signature Approval"}
          </span>
          <span className="text-xs text-slate-500">
            {isSigned
              ? `Approved by Pathologist ${signedBy}`
              : "This report is a draft and cannot be used for clinical diagnosis."}
          </span>
        </div>
      </div>
      {isSigned && signedAt && (
        <span className="text-3xs align-self-start sm:align-self-auto rounded-md border bg-slate-50 px-2.5 py-1 font-bold tracking-wider text-slate-400 uppercase">
          Timestamp: {signedAt}
        </span>
      )}
    </div>
  );
}
