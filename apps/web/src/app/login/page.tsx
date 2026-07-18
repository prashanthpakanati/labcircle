import React from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { FormHeader } from "@/components/auth/auth-headers";
import { User, ShieldAlert } from "lucide-react";

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <FormHeader
          title="Welcome to LabCircle"
          description="Please choose your access portal to continue."
        />

        <div className="flex flex-col gap-4">
          <Link
            href="/login/patient"
            className="group flex items-start gap-4 p-4 border border-slate-200 rounded-xl hover:border-amber-500 hover:bg-slate-50 transition-all shadow-sm"
          >
            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-600 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shrink-0">
              <User size={22} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 group-hover:text-slate-900 text-sm">
                Patient Portal
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Book diagnostics, download pathology reports, and view health timeline history.
              </p>
            </div>
          </Link>

          <Link
            href="/login/staff"
            className="group flex items-start gap-4 p-4 border border-slate-200 rounded-xl hover:border-slate-800 hover:bg-slate-50 transition-all shadow-sm"
          >
            <div className="p-3 bg-slate-100 rounded-lg text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-all shrink-0">
              <ShieldAlert size={22} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 group-hover:text-slate-900 text-sm">
                Clinical Staff Portal
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                For Phlebotomists, Lab Technicians, Pathologists, and Administrators.
              </p>
            </div>
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
