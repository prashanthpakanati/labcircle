import React from "react";

interface AuthCardProps {
  children: React.ReactNode;
}

export const AuthCard = ({ children }: AuthCardProps) => {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-xl p-8 md:p-10 flex flex-col gap-6">
      {children}
    </div>
  );
};
