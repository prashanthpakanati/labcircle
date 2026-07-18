"use client";

import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label = "Mobile Number", error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {/* Prefix indicator for India */}
          <div className="absolute left-3.5 flex items-center gap-1.5 text-sm font-semibold text-slate-500 select-none">
            <span className="text-base">🇮🇳</span>
            <span>+91</span>
            <span className="w-[1px] h-4 bg-slate-300 ml-1" />
          </div>
          <Input
            ref={ref}
            type="tel"
            pattern="[0-9]{10}"
            maxLength={10}
            className={`pl-20 text-slate-900 font-semibold tracking-wide ${
              error ? "border-red-500 focus:ring-red-500" : ""
            } ${className}`}
            placeholder="98765 43210"
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label = "Password", error, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <Input
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={`pr-10 text-slate-900 ${
              error ? "border-red-500 focus:ring-red-500" : ""
            } ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
PasswordField.displayName = "PasswordField";

interface OTPInputProps {
  value: string;
  onChange: (otp: string) => void;
  error?: string;
  length?: number;
}

export const OTPInput = ({ value, onChange, error, length = 6 }: OTPInputProps) => {
  const inputsRef = useRef<HTMLInputElement[]>([]);

  // Split values into individual character blocks
  const otpArray = value.split("").concat(Array(length).fill("")).slice(0, length);

  const handleInputChange = (element: HTMLInputElement, index: number) => {
    const inputValue = element.value;
    const newOtp = [...otpArray];
    newOtp[index] = inputValue.substring(inputValue.length - 1); // Get last typed char
    const combinedOtp = newOtp.join("");
    onChange(combinedOtp);

    // Auto-focus next box if filled
    if (inputValue && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newOtp = [...otpArray];
      if (!newOtp[index] && index > 0) {
        // Empty box backspace: delete previous and focus
        newOtp[index - 1] = "";
        inputsRef.current[index - 1]?.focus();
      } else {
        newOtp[index] = "";
      }
      onChange(newOtp.join(""));
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().slice(0, length);
    if (/^[0-9]+$/.test(pastedData)) {
      onChange(pastedData);
      inputsRef.current[Math.min(pastedData.length, length - 1)]?.focus();
    }
  };

  // Pre-fill inputs array length
  useEffect(() => {
    inputsRef.current = inputsRef.current.slice(0, length);
  }, [length]);

  return (
    <div className="flex flex-col gap-3 w-full items-center">
      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider select-none text-center">
        Enter Verification Code
      </label>
      <div className="flex gap-2 justify-center w-full">
        {Array(length)
          .fill(0)
          .map((_, i) => (
            <input
              key={i}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              ref={(el) => {
                if (el) inputsRef.current[i] = el;
              }}
              value={otpArray[i]}
              onChange={(e) => handleInputChange(e.target, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
              className={`w-12 h-14 text-center text-xl font-bold text-slate-900 border bg-white rounded-xl shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all ${
                error ? "border-red-500 ring-2 ring-red-500/10" : "border-slate-200"
              }`}
            />
          ))}
      </div>
      {error && <span className="text-xs text-red-500 text-center">{error}</span>}
    </div>
  );
};
