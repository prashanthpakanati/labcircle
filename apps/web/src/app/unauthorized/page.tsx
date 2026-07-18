import React from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { FormHeader, FormFooter } from "@/components/auth/auth-headers";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <div className="p-4 bg-red-50 text-red-500 rounded-full">
            <ShieldAlert size={36} />
          </div>

          <FormHeader
            title="Unauthorized Access"
            description="You do not have the permissions required to view this page."
          />

          <p className="text-sm text-slate-500 leading-relaxed max-w-xs mt-1">
            If you believe this is an error, please contact your clinical system administrator or log in with a different account.
          </p>

          <Link
            href="/"
            className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl flex items-center justify-center transition-all shadow-md mt-4"
          >
            Return to Homepage
          </Link>
        </div>

        <FormFooter
          linkText="Sign In as Different User"
          href="/login"
        />
      </AuthCard>
    </AuthLayout>
  );
}
