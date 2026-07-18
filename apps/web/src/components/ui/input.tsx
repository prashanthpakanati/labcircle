import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  isRequired?: boolean;
  isSuccess?: boolean;
  isReadOnly?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      errorText,
      isRequired = false,
      isSuccess = false,
      isReadOnly = false,
      disabled,
      id,
      type = "text",
      ...props
    },
    ref,
  ) => {
    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="flex items-center gap-0.5 text-sm font-medium text-slate-800 select-none"
          >
            {label}
            {isRequired && <span className="font-bold text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          <input
            id={id}
            ref={ref}
            type={type}
            disabled={disabled}
            readOnly={isReadOnly}
            className={cn(
              "border-border ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60",
              isReadOnly &&
                "cursor-default border-transparent bg-slate-50/50 px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
              isSuccess && "border-green-500 focus-visible:ring-green-500",
              errorText && "border-red-500 focus-visible:ring-red-500",
              className,
            )}
            {...props}
          />
        </div>

        {errorText && (
          <p className="flex items-center gap-1 text-xs font-medium text-red-500">
            <svg
              className="h-3.5 w-3.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errorText}
          </p>
        )}

        {helperText && !errorText && <p className="text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  },
);
Input.displayName = "Input";
