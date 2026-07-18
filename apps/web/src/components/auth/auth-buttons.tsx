import React from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/loading";

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export const LoadingButton = ({ isLoading, children, className = "", ...props }: LoadingButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isLoading || props.disabled}
      className={`w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {isLoading ? <Spinner size="sm" className="text-white" /> : children}
    </Button>
  );
};
