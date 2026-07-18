import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-slate-50 font-sans text-slate-900">
      {/* Brand panel: hidden on mobile, visible on desktop */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-slate-900 text-white flex-col justify-between p-12 overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 opacity-90" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-slate-950 text-lg">
              L
            </div>
            <span className="font-outfit text-xl font-bold tracking-tight text-white">
              Lab<span className="text-amber-400">Circle</span>
            </span>
          </div>
        </div>

        <div className="relative z-10 max-w-sm">
          <h1 className="font-outfit text-3xl font-bold leading-tight mb-4 text-white">
            India-first Preventive Diagnostic Platform
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Fast, secure, and reliable diagnostics, home collection trackings, and longevity care at your fingertips.
          </p>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          &copy; {new Date().getFullYear()} LabCircle. All rights reserved. ABDM & DPDP Compliant.
        </div>
      </div>

      {/* Main card grid container */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md flex flex-col gap-6">
          {/* Mobile header (logo display) */}
          <div className="lg:hidden flex justify-center mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-slate-950 text-lg">
                L
              </div>
              <span className="font-outfit text-xl font-bold tracking-tight text-slate-900">
                Lab<span className="text-amber-500">Circle</span>
              </span>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};
