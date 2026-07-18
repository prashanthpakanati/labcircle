import React from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

interface BannerProps {
  message: string | null | undefined;
}

export const ErrorBanner = ({ message }: BannerProps) => {
  if (!message) return null;

  return (
    <div className="flex gap-2.5 items-start bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl shadow-sm leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
      <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
      <span>{message}</span>
    </div>
  );
};

export const SuccessBanner = ({ message }: BannerProps) => {
  if (!message) return null;

  return (
    <div className="flex gap-2.5 items-start bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl shadow-sm leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
      <CheckCircle size={18} className="shrink-0 mt-0.5 text-green-500" />
      <span>{message}</span>
    </div>
  );
};
